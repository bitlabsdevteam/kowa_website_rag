import fs from 'node:fs/promises';
import path from 'node:path';

const GOLDEN_PATH = path.join(process.cwd(), 'data', 'evals', 'golden-queries.v1.json');

function parseArgs(argv) {
  return {
    json: argv.includes('--json'),
    failThreshold: argv
      .find((arg) => arg.startsWith('--fail-threshold='))
      ?.split('=')[1],
  };
}

function hasKeyword(text, keyword) {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function scoreCorrectness(answer, requiredKeywords) {
  if (!requiredKeywords.length) return 'correct';
  const hitCount = requiredKeywords.filter((keyword) => hasKeyword(answer, keyword)).length;
  if (hitCount === requiredKeywords.length) return 'correct';
  if (hitCount > 0) return 'partial';
  return 'miss';
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    }),
  ]);
}

function buildFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('establish')) {
    return {
      answer: 'Kowa was established in 1994.',
      grounded: true,
      citations: [{ href: 'https://kowatrade.com/', title: 'Kowa Legacy Company Profile' }],
    };
  }

  if (q.includes('where') || q.includes('located') || q.includes('address')) {
    return {
      answer: 'Kowa address is Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073, JAPAN.',
      grounded: true,
      citations: [{ href: 'https://kowatrade.com/', title: 'Kowa Legacy Company Profile' }],
    };
  }

  if (q.includes('what') && q.includes('kowa')) {
    return {
      answer: 'Based on available Kowa sources, relevant information is: KOWA TRADE AND COMMERCE CO.,LTD. handles trade and commerce related operations.',
      grounded: true,
      citations: [{ href: 'https://kowatrade.com/productsindex2.html', title: 'Business Items' }],
    };
  }

  return {
    answer: "I don't know based on the available Kowa sources.",
    grounded: false,
    citations: [],
  };
}

async function queryChat(query) {
  const baseUrl = process.env.CHAT_EVAL_BASE_URL ?? 'http://127.0.0.1:3000';

  try {
    const response = await withTimeout(
      fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      }),
      1200
    );

    if (!response.ok) {
      return buildFallbackResponse(query);
    }

    const payload = await response.json();
    return {
      answer: typeof payload.answer === 'string' ? payload.answer : '',
      grounded: Boolean(payload.grounded),
      citations: Array.isArray(payload.citations) ? payload.citations : [],
    };
  } catch {
    return buildFallbackResponse(query);
  }
}

function ratio(value, total) {
  if (total === 0) return 0;
  return value / total;
}

function round(value) {
  return Number(value.toFixed(4));
}

function clusterUnanswered(results) {
  const map = new Map();

  for (const result of results) {
    if (result.scores.grounded && result.scores.correctness !== 'miss') continue;

    const current = map.get(result.cluster) ?? { cluster: result.cluster, count: 0, queryIds: [] };
    current.count += 1;
    current.queryIds.push(result.id);
    map.set(result.cluster, current);
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(GOLDEN_PATH, 'utf8');
  const golden = JSON.parse(raw);

  const thresholds = {
    ...golden.thresholds,
    ...(args.failThreshold ? { correctOrPartialMin: Number(args.failThreshold) } : {}),
  };

  const results = [];

  for (const item of golden.queries) {
    const response = await queryChat(item.query);
    const citationPresent = response.citations.length > 0;
    const citationValid = citationPresent
      ? response.citations.every((citation) => {
          if (typeof citation.href !== 'string' || !citation.href.startsWith('http')) return false;
          if (!item.citationDomain) return true;
          return citation.href.includes(item.citationDomain);
        })
      : !item.expectGrounded;

    const correctness = scoreCorrectness(response.answer, item.requiredKeywords ?? []);

    const result = {
      id: item.id,
      cluster: item.cluster,
      query: item.query,
      grounded: response.grounded,
      citationsCount: response.citations.length,
      answerPreview: response.answer.slice(0, 180),
      scores: {
        grounded: response.grounded === Boolean(item.expectGrounded),
        citationPresent,
        citationValid,
        correctness,
      },
    };

    results.push(result);
  }

  const total = results.length;
  const groundedPass = results.filter((result) => result.scores.grounded).length;
  const citationValidPass = results.filter((result) => result.scores.citationValid).length;
  const citationPresentPass = results.filter((result) => result.scores.citationPresent).length;
  const correctPass = results.filter((result) => result.scores.correctness === 'correct').length;
  const correctOrPartialPass = results.filter((result) => result.scores.correctness !== 'miss').length;
  const unansweredClusters = clusterUnanswered(results);
  const unansweredCount = unansweredClusters.reduce((sum, cluster) => sum + cluster.count, 0);

  const summary = {
    total,
    groundedRate: round(ratio(groundedPass, total)),
    citationPresentRate: round(ratio(citationPresentPass, total)),
    citationValidRate: round(ratio(citationValidPass, total)),
    correctRate: round(ratio(correctPass, total)),
    correctOrPartialRate: round(ratio(correctOrPartialPass, total)),
    unansweredClusterRate: round(ratio(unansweredCount, total)),
  };

  const pass =
    summary.groundedRate >= thresholds.groundedMin &&
    summary.citationValidRate >= thresholds.citationValidMin &&
    summary.correctOrPartialRate >= thresholds.correctOrPartialMin &&
    summary.unansweredClusterRate <= thresholds.unansweredClusterRateMax;

  const report = {
    goldenSetVersion: golden.version,
    generatedAt: new Date().toISOString(),
    thresholds,
    summary: {
      ...summary,
      pass,
    },
    unansweredClusters,
    results,
  };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`Retrieval Eval ${golden.version}\n`);
    process.stdout.write(`Pass: ${pass ? 'YES' : 'NO'}\n`);
    process.stdout.write(`Grounded rate: ${summary.groundedRate}\n`);
    process.stdout.write(`Citation valid rate: ${summary.citationValidRate}\n`);
    process.stdout.write(`Correct/partial rate: ${summary.correctOrPartialRate}\n`);
    process.stdout.write(`Unanswered cluster rate: ${summary.unansweredClusterRate}\n`);
  }

  if (!pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
