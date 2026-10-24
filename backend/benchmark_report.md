# Benchmark Summary
* Repositories Tested: 17
* Total Files Processed: 5273
* Total Semantic Chunks: 51150
* Average Chunks per Repository: 3196.88
* Average Indexing Time: 47.20 seconds
* Average Query Response Time: 7.43 seconds
* Programming Languages Supported: 43

## Repository Coverage
* Total repositories tested: 17
* Total source files processed: 5273
* Total semantic chunks generated: 51150
* Total embeddings stored: 51150
* Total successful queries executed: 12

## Language Support
* Supported programming languages: 43
* Repositories per language:
  * .sh: 5 repositories
  * .md: 16 repositories
  * .typed: 6 repositories
  * .yaml: 7 repositories
  * .lock: 6 repositories
  * .toml: 8 repositories
  * .js: 9 repositories
  * .yml: 14 repositories
  * .html: 10 repositories
  * .py: 8 repositories
  * .cff: 3 repositories
  * .css: 11 repositories
  * .rst: 3 repositories
  * .bat: 3 repositories
  * .json: 11 repositories
  * .sql: 1 repositories
  * .txt: 9 repositories
  * .ejs: 1 repositories
  * .tmpl: 1 repositories
  * .hbs: 1 repositories
  * .send: 1 repositories
  * .tsx: 1 repositories
  * .example: 1 repositories
  * .mjs: 1 repositories
  * .ts: 3 repositories
  * .jst: 1 repositories
  * .in: 3 repositories
  * .pem: 3 repositories
  * .csr: 2 repositories
  * .crt: 1 repositories
  * .ini: 4 repositories
  * .cnf: 1 repositories
  * .key: 1 repositories
  * .srl: 2 repositories
  * .pyi: 1 repositories
  * .rs: 1 repositories
  * .cts: 1 repositories
  * .webmanifest: 1 repositories
  * .patch: 1 repositories
  * .mts: 1 repositories
  * .cjs: 1 repositories
  * .eslintrc: 1 repositories
  * .babelrc: 1 repositories

## Chunking Metrics
* Total chunks generated: 51150
* Average chunks per repository: 3196.88
* Maximum chunks generated for a single repository: 19695

## Detailed Per-Repository Statistics

### fastapi
- URL: https://github.com/tiangolo/fastapi
- Languages: .sh, .md, .typed, .yaml, .lock, .toml, .js, .yml, .html, .py, .cff, .css
- Total source files processed: 2753
- Files skipped: 243
- Total semantic chunks generated: 19695
- Chunks per file: 7.15
- Average chunk size: 827.0 characters
- Largest chunk: 1000 characters
- Smallest chunk: 1 characters

#### Indexing Metrics
- Repository cloning time: 17.18s
- Parsing time: 1.05s
- Chunk generation time: 0.62s
- Embedding generation & ChromaDB indexing time: 230.24s
- Total indexing time: 249.09s

#### Retrieval Metrics (10 queries)
- Average query latency: 1.76s
- Median latency: 1.66s
- Minimum latency: 1.62s
- Maximum latency: 2.27s

### flask
- URL: https://github.com/pallets/flask
- Languages: .sh, .html, .rst, .md, .bat, .typed, .yaml, .lock, .toml, .json, .yml, .sql, .py, .txt, .css
- Total source files processed: 228
- Files skipped: 8
- Total semantic chunks generated: 1959
- Chunks per file: 8.59
- Average chunk size: 806.6 characters
- Largest chunk: 1000 characters
- Smallest chunk: 10 characters

#### Indexing Metrics
- Repository cloning time: 5.26s
- Parsing time: 0.14s
- Chunk generation time: 0.05s
- Embedding generation & ChromaDB indexing time: 29.67s
- Total indexing time: 35.12s

#### Retrieval Metrics (10 queries)
- Average query latency: 18.77s
- Median latency: 18.43s
- Minimum latency: 2.22s
- Maximum latency: 35.99s

### express
- URL: https://github.com/expressjs/express
- Languages: .md, .ejs, .tmpl, .js, .json, .yml, .hbs, .send, .html, .txt, .css
- Total source files processed: 213
- Files skipped: 0
- Total semantic chunks generated: 1019
- Chunks per file: 4.78
- Average chunk size: 769.4 characters
- Largest chunk: 1000 characters
- Smallest chunk: 3 characters

#### Indexing Metrics
- Repository cloning time: 4.96s
- Parsing time: 0.08s
- Chunk generation time: 0.02s
- Embedding generation & ChromaDB indexing time: 14.41s
- Total indexing time: 19.47s

### react
**Error**: Clone failed: Cmd('git') failed due to: exit code(128)
  cmdline: git clone -v -- https://github.com/facebook/react repos\react
  stderr: 'Cloning into 'repos\react'...
POST git-upload-pack (193 bytes)
POST git-upload-pack (gzip 52985 to 25960 bytes)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/effect-derived-computations/effect-with-cleanup-function-depending-on-derived-computation-value.expect.md: Filename too long
Updating files:  18% (1374/7243)
Updating files:  19% (1377/7243)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/error.repro-preserve-memoization-inner-destructured-value-mistaken-as-dependency-later-mutation.expect.md: Filename too long
Updating files:  20% (1449/7243)
Updating files:  21% (1522/7243)
Updating files:  22% (1594/7243)
Updating files:  23% (1666/7243)
Updating files:  24% (1739/7243)
Updating files:  25% (1811/7243)
Updating files:  26% (1884/7243)
Updating files:  27% (1956/7243)
Updating files:  28% (2029/7243)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/inner-function/nullable-objects/assume-invoked/function-with-conditional-callsite-in-another-function.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/inner-function/nullable-objects/assume-invoked/function-with-conditional-callsite-in-another-function.ts: Filename too long
Updating files:  29% (2101/7243)
Updating files:  30% (2173/7243)
Updating files:  31% (2246/7243)
Updating files:  32% (2318/7243)
Updating files:  33% (2391/7243)
Updating files:  34% (2463/7243)
Updating files:  35% (2536/7243)
Updating files:  36% (2608/7243)
Updating files:  37% (2680/7243)
Updating files:  37% (2743/7243)
Updating files:  38% (2753/7243)
Updating files:  39% (2825/7243)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/error.todo-optional-member-expression-with-conditional-optional.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/reactive-dependencies-non-optional-properties-inside-optional-chain.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/reduce-reactive-deps/infer-function-uncond-access-hoists-other-dep.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/reduce-reactive-deps/infer-function-uncond-optional-hoists-other-dep.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/reduce-reactive-deps/infer-nested-function-uncond-access-local-var.expect.md: Filename too long
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/propagate-scope-deps-hir-fork/reduce-reactive-deps/todo-infer-function-uncond-optionals-hoisted.expect.md: Filename too long
Updating files:  40% (2898/7243)
Updating files:  41% (2970/7243)
Updating files:  42% (3043/7243)
Updating files:  43% (3115/7243)
Updating files:  44% (3187/7243)
Updating files:  45% (3260/7243)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/repro-object-expression-computed-key-modified-during-after-construction-hoisted-sequence-expr.expect.md: Filename too long
Updating files:  46% (3332/7243)
Updating files:  47% (3405/7243)
Updating files:  48% (3477/7243)
Updating files:  49% (3550/7243)
Updating files:  50% (3622/7243)
Updating files:  51% (3694/7243)
Updating files:  52% (3767/7243)
Updating files:  53% (3839/7243)
Updating files:  54% (3912/7243)
Updating files:  55% (3984/7243)
error: unable to create file compiler/packages/babel-plugin-react-compiler/src/__tests__/fixtures/compiler/useCallback-call-second-function-which-captures-maybe-mutable-value-dont-preserve-memoization.expect.md: Filename too long
Updating files:  56% (4057/7243)
Updating files:  56% (4112/7243)
Updating files:  57% (4129/7243)
Updating files:  58% (4201/7243)
Updating files:  59% (4274/7243)
Updating files:  60% (4346/7243)
Updating files:  61% (4419/7243)
Updating files:  62% (4491/7243)
Updating files:  63% (4564/7243)
Updating files:  64% (4636/7243)
Updating files:  65% (4708/7243)
Updating files:  66% (4781/7243)
Updating files:  67% (4853/7243)
Updating files:  68% (4926/7243)
Updating files:  69% (4998/7243)
Updating files:  70% (5071/7243)
Updating files:  71% (5143/7243)
Updating files:  72% (5215/7243)
Updating files:  72% (5234/7243)
Updating files:  73% (5288/7243)
Updating files:  74% (5360/7243)
Updating files:  75% (5433/7243)
Updating files:  76% (5505/7243)
Updating files:  77% (5578/7243)
Updating files:  78% (5650/7243)
Updating files:  79% (5722/7243)
Updating files:  80% (5795/7243)
Updating files:  81% (5867/7243)
Updating files:  82% (5940/7243)
Updating files:  83% (6012/7243)
Updating files:  84% (6085/7243)
Updating files:  85% (6157/7243)
Updating files:  86% (6229/7243)
Updating files:  87% (6302/7243)
Updating files:  88% (6374/7243)
Updating files:  88% (6381/7243)
Updating files:  89% (6447/7243)
Updating files:  90% (6519/7243)
Updating files:  91% (6592/7243)
Updating files:  92% (6664/7243)
Updating files:  93% (6736/7243)
Updating files:  94% (6809/7243)
Updating files:  95% (6881/7243)
Updating files:  96% (6954/7243)
Updating files:  97% (7026/7243)
Updating files:  98% (7099/7243)
Updating files:  99% (7171/7243)
Updating files: 100% (7243/7243)
Updating files: 100% (7243/7243), done.
fatal: unable to checkout working tree
warning: Clone succeeded, but checkout failed.
You can inspect what was checked out with 'git status'
and retry with 'git restore --source=HEAD :/'

'

### chat-langchain
- URL: https://github.com/hwchase17/chat-langchain
- Languages: .sh, .md, .tsx, .toml, .example, .json, .mjs, .py, .ts, .css
- Total source files processed: 124
- Files skipped: 12
- Total semantic chunks generated: 859
- Chunks per file: 6.93
- Average chunk size: 733.2 characters
- Largest chunk: 1000 characters
- Smallest chunk: 6 characters

#### Indexing Metrics
- Repository cloning time: 19.02s
- Parsing time: 0.05s
- Chunk generation time: 0.02s
- Embedding generation & ChromaDB indexing time: 12.31s
- Total indexing time: 31.39s

### lodash
- URL: https://github.com/lodash/lodash
- Languages: .md, .jst, .js, .json, .yml, .html, .txt, .css
- Total source files processed: 94
- Files skipped: 59
- Total semantic chunks generated: 4690
- Chunks per file: 49.89
- Average chunk size: 832.2 characters
- Largest chunk: 999 characters
- Smallest chunk: 2 characters

#### Indexing Metrics
- Repository cloning time: 13.10s
- Parsing time: 0.04s
- Chunk generation time: 0.07s
- Embedding generation & ChromaDB indexing time: 65.48s
- Total indexing time: 78.69s

### chalk
- URL: https://github.com/chalk/chalk
- Languages: .md, .js, .json, .yml, .ts
- Total source files processed: 31
- Files skipped: 3
- Total semantic chunks generated: 99
- Chunks per file: 3.19
- Average chunk size: 737.7 characters
- Largest chunk: 998 characters
- Smallest chunk: 18 characters

#### Indexing Metrics
- Repository cloning time: 2.29s
- Parsing time: 0.01s
- Chunk generation time: 0.00s
- Embedding generation & ChromaDB indexing time: 1.93s
- Total indexing time: 4.24s

### requests
- URL: https://github.com/psf/requests
- Languages: .md, .yaml, .in, .pem, .html, .csr, .txt, .crt, .css, .bat, .ini, .yml, .py, .rst, .cnf, .toml, .key, .typed, .srl
- Total source files processed: 123
- Files skipped: 7
- Total semantic chunks generated: 933
- Chunks per file: 7.59
- Average chunk size: 777.2 characters
- Largest chunk: 998 characters
- Smallest chunk: 13 characters

#### Indexing Metrics
- Repository cloning time: 12.43s
- Parsing time: 0.03s
- Chunk generation time: 0.01s
- Embedding generation & ChromaDB indexing time: 7.75s
- Total indexing time: 20.21s

### click
- URL: https://github.com/pallets/click
- Languages: .sh, .md, .typed, .yaml, .lock, .toml, .json, .yml, .ini, .py, .txt
- Total source files processed: 145
- Files skipped: 5
- Total semantic chunks generated: 1928
- Chunks per file: 13.30
- Average chunk size: 797.4 characters
- Largest chunk: 1000 characters
- Smallest chunk: 11 characters

#### Indexing Metrics
- Repository cloning time: 3.12s
- Parsing time: 0.04s
- Chunk generation time: 0.03s
- Embedding generation & ChromaDB indexing time: 16.28s
- Total indexing time: 19.47s

### starlette
- URL: https://github.com/encode/starlette
- Languages: .md, .typed, .txt, .lock, .toml, .yml, .html, .py, .cff, .css
- Total source files processed: 123
- Files skipped: 6
- Total semantic chunks generated: 1547
- Chunks per file: 12.58
- Average chunk size: 801.9 characters
- Largest chunk: 998 characters
- Smallest chunk: 3 characters

#### Indexing Metrics
- Repository cloning time: 4.25s
- Parsing time: 0.04s
- Chunk generation time: 0.02s
- Embedding generation & ChromaDB indexing time: 22.14s
- Total indexing time: 26.46s

### pydantic
- URL: https://github.com/pydantic/pydantic
- Languages: .sh, .md, .typed, .css, .yaml, .lock, .in, .toml, .js, .json, .yml, .ini, .html, .pyi, .py, .rs, .cff, .txt
- Total source files processed: 720
- Files skipped: 55
- Total semantic chunks generated: 12864
- Chunks per file: 17.87
- Average chunk size: 793.4 characters
- Largest chunk: 1000 characters
- Smallest chunk: 4 characters

#### Indexing Metrics
- Repository cloning time: 90.78s
- Parsing time: 0.14s
- Chunk generation time: 0.12s
- Embedding generation & ChromaDB indexing time: 95.28s
- Total indexing time: 186.33s

### axios
- URL: https://github.com/axios/axios
- Languages: .md, .cts, .lock, .webmanifest, .patch, .js, .json, .yml, .mts, .pem, .html, .cjs, .ts, .css
- Total source files processed: 436
- Files skipped: 18
- Total semantic chunks generated: 3502
- Chunks per file: 8.03
- Average chunk size: 789.3 characters
- Largest chunk: 1000 characters
- Smallest chunk: 1 characters

#### Indexing Metrics
- Repository cloning time: 10.81s
- Parsing time: 0.09s
- Chunk generation time: 0.04s
- Embedding generation & ChromaDB indexing time: 29.18s
- Total indexing time: 40.12s

### superagent
- URL: https://github.com/visionmedia/superagent
- Languages: .csr, .md, .eslintrc, .js, .yml, .json, .pem, .html, .babelrc, .txt, .srl, .css
- Total source files processed: 117
- Files skipped: 6
- Total semantic chunks generated: 1209
- Chunks per file: 10.33
- Average chunk size: 840.7 characters
- Largest chunk: 1000 characters
- Smallest chunk: 3 characters

#### Indexing Metrics
- Repository cloning time: 3.96s
- Parsing time: 0.02s
- Chunk generation time: 0.02s
- Embedding generation & ChromaDB indexing time: 10.57s
- Total indexing time: 14.57s

### koa
- URL: https://github.com/koajs/koa
- Languages: .md, .js, .json, .yml
- Total source files processed: 108
- Files skipped: 3
- Total semantic chunks generated: 472
- Chunks per file: 4.37
- Average chunk size: 797.4 characters
- Largest chunk: 1000 characters
- Smallest chunk: 22 characters

#### Indexing Metrics
- Repository cloning time: 13.32s
- Parsing time: 0.02s
- Chunk generation time: 0.00s
- Embedding generation & ChromaDB indexing time: 4.14s
- Total indexing time: 17.48s

### isarray
- URL: https://github.com/juliangruber/isarray
- Languages: .md, .yaml, .js, .json, .yml
- Total source files processed: 20
- Files skipped: 1
- Total semantic chunks generated: 24
- Chunks per file: 1.20
- Average chunk size: 414.4 characters
- Largest chunk: 998 characters
- Smallest chunk: 12 characters

#### Indexing Metrics
- Repository cloning time: 1.74s
- Parsing time: 0.00s
- Chunk generation time: 0.00s
- Embedding generation & ChromaDB indexing time: 0.40s
- Total indexing time: 2.15s

### asyncio
- URL: https://github.com/python/asyncio
- Languages: .md
- Total source files processed: 2
- Files skipped: 0
- Total semantic chunks generated: 2
- Chunks per file: 1.00
- Average chunk size: 180.0 characters
- Largest chunk: 259 characters
- Smallest chunk: 101 characters

#### Indexing Metrics
- Repository cloning time: 2.52s
- Parsing time: 0.00s
- Chunk generation time: 0.00s
- Embedding generation & ChromaDB indexing time: 0.08s
- Total indexing time: 2.60s

### Flask-SocketIO
- URL: https://github.com/miguelgrinberg/Flask-SocketIO
- Languages: .md, .rst, .bat, .yaml, .txt, .in, .toml, .yml, .ini, .html, .py, .css
- Total source files processed: 36
- Files skipped: 0
- Total semantic chunks generated: 348
- Chunks per file: 9.67
- Average chunk size: 736.5 characters
- Largest chunk: 995 characters
- Smallest chunk: 28 characters

#### Indexing Metrics
- Repository cloning time: 2.30s
- Parsing time: 0.01s
- Chunk generation time: 0.01s
- Embedding generation & ChromaDB indexing time: 5.53s
- Total indexing time: 7.85s

## Resume Ready Metrics
* Tested across 17 public repositories
* Processed 5273 source files
* Generated 51150 semantic code chunks
* Average repository indexing time: 47.20 seconds
* Average semantic search latency: 0.00 seconds
* Average LLM response latency: 7.43 seconds
* Supports 43 programming languages