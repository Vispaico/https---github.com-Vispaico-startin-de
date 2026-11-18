# Provider benchmark harness

`npm run benchmark` runs anonymised JSONL samples against one OpenAI-compatible model endpoint. Set `BENCHMARK_DATASET`, `BENCHMARK_API_URL`, `BENCHMARK_API_KEY`, and `BENCHMARK_MODEL`. Optional price variables: `BENCHMARK_INPUT_USD_PER_MILLION` and `BENCHMARK_OUTPUT_USD_PER_MILLION`.

Each line must have this shape:

```json
{"id":"synthetic-01","documentType":"german_cv","text":"Anonymised, synthetic or appropriately consented text","forbiddenClaims":["not present in source"]}
```

The harness reports schema-valid rate, exact evidence-quote accuracy, simple forbidden-claim matches, latency, tokens and estimated cost. It does not print the source text or provider output. A 30–50 case benchmark with human-labelled expected findings, German/Vietnamese coverage, scans and omission precision/recall is still required before selecting a production model. Only synthetic/anonymised documents should be used unless a separate lawful basis and safeguards are approved.
