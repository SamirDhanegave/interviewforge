import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  bg:"#09090f",surf:"#0f0f1a",surf2:"#14141f",
  border:"rgba(255,255,255,0.07)",border2:"rgba(255,255,255,0.13)",
  text:"#eeeef5",muted:"#7878a0",
  accent:"#6e6bff",accent2:"#ff6b6b",accent3:"#00d4aa",gold:"#f0c060",green:"#4ade80",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:${C.bg};color:${C.text};font-family:'Syne',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  button{font-family:'Syne',sans-serif;cursor:pointer}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:4px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .fu{animation:fadeUp .4s ease both}
  .fu1{animation:fadeUp .4s .08s ease both}
  .fu2{animation:fadeUp .4s .16s ease both}
  .fu3{animation:fadeUp .4s .24s ease both}
  .fu4{animation:fadeUp .4s .32s ease both}
  .ticker-t{animation:ticker 32s linear infinite;display:flex;width:max-content}
  .ticker-t:hover{animation-play-state:paused}

  pre{font-family:'DM Mono',monospace;font-size:.78rem;line-height:1.75;overflow-x:auto;white-space:pre;color:#c9d1d9;padding:20px 22px}
  .kw{color:#ff7b72}.fn{color:#d2a8ff}.st{color:#a5d6ff}.cm{color:#8b949e;font-style:italic}.nm{color:#79c0ff}.cl{color:#ffa657}

  .rcard{transition:all .25s;cursor:pointer}
  .rcard:hover{transform:translateY(-4px)}
  .qacard{transition:border-color .2s}
  .qacard:hover{border-color:${C.border2}!important}

  .nav-bar{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:14px 28px;transition:all .35s}
  .nav-scrolled{background:rgba(9,9,15,.92)!important;backdrop-filter:blur(20px);border-bottom:1px solid ${C.border}}

  .mob-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:149;opacity:0;pointer-events:none;transition:opacity .3s}
  .mob-overlay.show{opacity:1;pointer-events:all}
  .mob-drawer{position:fixed;left:0;top:0;bottom:0;width:min(280px,85vw);background:${C.surf};border-right:1px solid ${C.border};z-index:150;transform:translateX(-100%);transition:transform .3s ease;overflow-y:auto;padding-top:70px}
  .mob-drawer.show{transform:translateX(0)}

  @media(min-width:860px){
    .sidebar-desk{display:flex!important;flex-direction:column;width:230px;flex-shrink:0;border-right:1px solid ${C.border};position:sticky;top:70px;height:calc(100vh - 70px);overflow-y:auto}
    .mob-drawer,.mob-overlay,.mob-sidebar-btn{display:none!important}
  }
  @media(max-width:859px){
    .sidebar-desk{display:none!important}
    .nav-desktop{display:none!important}
    .mob-hamburger{display:flex!important}
  }
  @media(min-width:860px){
    .mob-hamburger{display:none!important}
    .nav-desktop{display:flex!important}
  }
`;

const ROLES = [
  {
    id:"frontend",icon:"⚡",name:"Frontend Developer",color:"#6e6bff",
    desc:"HTML, CSS, JavaScript, React, performance optimization, and browser APIs. Covers everything asked at companies from startups to FAANG.",
    topics:["Core JavaScript","React & Hooks","Performance","Browser APIs"],
    qa:[
      {topic:"Core JavaScript",items:[
        {q:"Explain the difference between var, let, and const.",diff:"easy",
         a:"var is function-scoped and hoisted (initialized as undefined). let and const are block-scoped and live in the temporal dead zone until declared — accessing them before declaration throws a ReferenceError.\n\nconst prevents reassignment but does NOT make objects immutable — you can still mutate their properties. Use const by default, let when you need to reassign, and avoid var entirely in modern code.",
         tip:"Mention the temporal dead zone — most junior devs miss it, interviewers know this."},
        {q:"What is event delegation and why is it useful?",diff:"medium",
         a:"Event delegation attaches a single listener to a parent element instead of many children. It works because DOM events bubble up the tree — when a child fires an event it propagates to the parent, which checks event.target to identify the source.\n\nBenefits: fewer event listeners (better memory), works for dynamically added elements without re-binding, and simplifies cleanup.",
         tip:"Give a concrete example: a click handler on <ul> handling all <li> children including ones added dynamically."},
        {q:"What is a closure? Give a real-world use case.",diff:"medium",
         a:"A closure is a function that retains access to its outer scope's variables even after the outer function has returned. Every function in JavaScript forms a closure.\n\nReal use cases: data privacy via the module pattern, factory functions returning configured functions, memoization caches, and React hooks — useState internally uses closures to retain state between renders.",
         tip:""},
        {q:"Explain the JavaScript event loop in detail.",diff:"hard",
         a:"JavaScript is single-threaded. The call stack executes synchronous code. Async operations are handled by Web APIs, which push callbacks into queues.\n\nThe event loop drains the microtask queue completely (Promises, queueMicrotask) before picking one task from the macrotask queue (setTimeout, setInterval). This is why Promise.resolve().then() always runs before setTimeout(fn, 0).",
         tip:"Draw the two queues on a whiteboard — visual thinkers stand out."},
        {q:"How does prototypal inheritance work?",diff:"medium",
         a:"Every JavaScript object has an internal [[Prototype]] link. Property lookup walks this chain until the property is found or null is reached.\n\nWhen you call arr.map(), JS looks: arr → Array.prototype → Object.prototype → null. ES6 classes are syntactic sugar over this prototype chain. Object.create() lets you set the prototype explicitly.",
         tip:""},
      ]},
      {topic:"React & Hooks",items:[
        {q:"useState vs useReducer — when do you use each?",diff:"medium",
         a:"useState is ideal for simple, independent state values. useReducer shines when transitions are complex, depend on previous state, or multiple sub-values change together.\n\nRule of thumb: if you have more than 2–3 setState conditions, or you're passing multiple setters through props, switch to useReducer. It also makes unit testing easier — test the reducer in isolation.",
         tip:""},
        {q:"What does useCallback solve? When is it NOT needed?",diff:"hard",
         a:"useCallback memoizes a function reference so it doesn't change on every render, preventing child re-renders when the function is passed as a prop.\n\nNOT needed for most cases — memoization overhead can exceed the benefit. Only use when: (1) passing to a React.memo-wrapped child, or (2) the function is a useEffect/useMemo dependency. Premature useCallback is a common junior mistake.",
         tip:"Saying 'premature optimization' signals senior-level thinking."},
        {q:"How does React reconciliation work?",diff:"hard",
         a:"React keeps a Virtual DOM. On state change it creates a new VDOM tree and diffs it against the previous one.\n\nRules: different element types → entirely different trees; siblings with stable key props → matched by key; same component type at same position → state preserved. React Fiber (v16+) made this incremental and interruptible for large trees.",
         tip:""},
      ]},
      {topic:"Performance",items:[
        {q:"What is code splitting and how do you implement it?",diff:"medium",
         a:"Code splitting divides your JS bundle into smaller chunks loaded on demand, reducing initial load. In React, use React.lazy() with Suspense for component-level splitting.\n\nRoute-level splitting is most impactful — React Router supports lazy routes, Next.js splits automatically per page. Also dynamic import() for heavy libraries used conditionally (chart libraries, rich text editors).",
         tip:""},
        {q:"Explain the Critical Rendering Path and optimizations.",diff:"hard",
         a:"CRP: HTML parsing → DOM → CSSOM → Render Tree → Layout → Paint → Composite.\n\nOptimizations: (1) Eliminate render-blocking resources — defer/async scripts. (2) Inline critical CSS. (3) Preload key assets. (4) Avoid layout thrashing — batch DOM reads/writes. (5) Use will-change or transform for GPU-layer animations. (6) Lazy-load images.",
         tip:""},
      ]},
      {topic:"Browser APIs",items:[
        {q:"localStorage vs sessionStorage vs cookies — key differences.",diff:"easy",
         a:"localStorage: persists across sessions, ~5–10MB, never sent to server. sessionStorage: cleared when tab closes, ~5MB, never sent to server. Cookies: sent with every HTTP request (bandwidth cost!), 4KB limit, can be HttpOnly (no JS access), Secure, and SameSite.\n\nFor auth tokens: HttpOnly cookies (XSS-resistant). For UI preferences: localStorage. For tab-specific state: sessionStorage.",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"Debounce Function",diff:"medium",lang:"JavaScript",
       desc:"Implement a <strong>debounce</strong> utility from scratch — only execute after the user stops calling it for a given delay.",
       input:"debounce(fn, 300) called rapidly",output:"fn fires once, 300ms after last call",
       code:`function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const search = debounce(query => fetchResults(query), 300);
input.addEventListener('input', e => search(e.target.value));`,
       time:"O(1)",space:"O(1)"},
      {title:"Deep Clone with Circular Ref Handling",diff:"hard",lang:"JavaScript",
       desc:"Implement deep clone handling nested objects, arrays, Dates, and <strong>circular references</strong>. JSON.parse/stringify fails on Dates and circular refs.",
       input:"{a:1, b:{c:[1,2]}, d:new Date()}",output:"Identical deep copy, no shared references",
       code:`function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj); // circular ref guard
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  return clone;
}`,
       time:"O(n)",space:"O(n)"},
      {title:"Promise.all Implementation",diff:"hard",lang:"JavaScript",
       desc:"Implement <strong>Promise.all</strong> from scratch — resolves when all promises resolve, rejects immediately if any promise rejects.",
       input:"[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]",output:"[1, 2, 3]",
       code:`function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (--remaining === 0) resolve(results);
      }).catch(reject); // first rejection wins
    });
  });
}`,
       time:"O(n)",space:"O(n)"},
    ],
    tips:[
      "Always explain your thought process before writing code — interviewers evaluate reasoning, not just output.",
      "For React questions, mention trade-offs. Nothing signals seniority like 'it depends — here's when I'd use X vs Y.'",
      "Know browser DevTools deeply — performance tab, network waterfall, and Lighthouse are common conversation topics.",
      "Know SSR vs SSG vs ISR vs CSR rendering differences — product companies ask this constantly.",
      "Prepare a 'war story' — a real performance win or tricky bug. Problem → root cause → fix → measurable outcome.",
    ]
  },
  {
    id:"backend",icon:"🔧",name:"Backend Engineer",color:"#00d4aa",
    desc:"APIs, databases, caching, message queues, and scalability patterns. Node.js, Python, system design, and everything asked at high-growth companies.",
    topics:["REST & APIs","Databases","Caching","System Design"],
    qa:[
      {topic:"REST & APIs",items:[
        {q:"What are the principles of RESTful API design?",diff:"easy",
         a:"REST has 6 constraints: Client-Server separation, Stateless (each request is self-contained), Cacheable, Uniform Interface, Layered System, Code on Demand (optional).\n\nPractical rules: use nouns for resources (/users not /getUsers), HTTP verbs for actions (GET/POST/PUT/PATCH/DELETE), correct status codes (201 Created, 204 No Content, 404 Not Found, 422 Unprocessable), versioning (/api/v1/), and consistent error response shapes.",
         tip:""},
        {q:"When would you use GraphQL over REST?",diff:"medium",
         a:"GraphQL solves over-fetching (too much data) and under-fetching (multiple round trips). Use when: mobile clients need bandwidth efficiency, data is a complex interconnected graph, multiple clients need different data shapes, or frontend must iterate rapidly without backend changes.\n\nDownsides: harder HTTP caching, N+1 risk on resolvers, more complex backend setup — overkill for simple CRUD APIs.",
         tip:""},
        {q:"Explain idempotency. Which HTTP methods must be idempotent?",diff:"medium",
         a:"An operation is idempotent if performing it multiple times produces the same result as once. GET, PUT, DELETE, HEAD, OPTIONS are idempotent. POST is NOT — it creates a new resource each time.\n\nThis matters for retry logic: safe to retry GET/PUT/DELETE on timeout. For POST, use idempotency keys (like Stripe's Idempotency-Key header) to make retries safe without duplicate side effects.",
         tip:""},
      ]},
      {topic:"Databases",items:[
        {q:"SQL vs NoSQL — when do you choose each?",diff:"medium",
         a:"SQL (PostgreSQL, MySQL): structured schema, ACID transactions, powerful JOINs, great for relational data with complex queries.\n\nNoSQL (MongoDB, DynamoDB, Cassandra): schema flexibility, designed for horizontal scaling, optimized for specific access patterns. Choose NoSQL when schema changes frequently, you need massive horizontal scale, or data is document/key-value/time-series shaped.",
         tip:""},
        {q:"How do B-tree database indexes work?",diff:"hard",
         a:"B-tree indexes store sorted keys in a balanced tree where every root-to-leaf path is equal length. Lookups are O(log n). They support equality queries, range queries, ORDER BY, and prefix matching.\n\nThey do NOT help for: low-cardinality columns (boolean), columns inside functions in WHERE, or leading % LIKE searches. Composite indexes follow the leftmost prefix rule.",
         tip:"Drawing the B-tree on a whiteboard signals strong CS fundamentals."},
        {q:"What is the N+1 query problem?",diff:"medium",
         a:"N+1 occurs when you fetch N records then issue 1 additional query per record — e.g., fetch 100 users then query each user's posts = 101 queries.\n\nFixes: (1) SQL JOIN to fetch everything at once. (2) ORM eager loading (include/with). (3) DataLoader pattern — batch and deduplicate per request. (4) Denormalize for read-heavy paths.",
         tip:""},
      ]},
      {topic:"Caching",items:[
        {q:"Explain cache-aside, write-through, and write-behind patterns.",diff:"hard",
         a:"Cache-aside: app checks cache → miss → fetch DB → populate cache. Only caches what's requested. Risk: stale data after DB updates.\n\nWrite-through: write to cache AND DB atomically. Always consistent, higher write latency.\n\nWrite-behind: write to cache immediately, async flush to DB. Lowest latency, risk of data loss on crash.",
         tip:""},
      ]},
      {topic:"System Design",items:[
        {q:"How would you design a URL shortener like bit.ly?",diff:"hard",
         a:"Scale: 100M URLs, 1B reads/day (10:1 read-heavy).\n\nCore design: Generate short code via base62 encoding of auto-incremented ID. Store in DynamoDB/Cassandra (shortCode → longURL). Cache hot URLs in Redis — 20% of URLs = 80% of traffic. CDN for global low-latency redirects.\n\nAPI: POST /shorten → 201 + shortCode. GET /{code} → 301 redirect. Analytics: async via Kafka — never block the critical redirect path.",
         tip:"Always mention async analytics — blocking the redirect for tracking is a common design mistake."},
      ]},
    ],
    challenges:[
      {title:"LRU Cache",diff:"hard",lang:"JavaScript",
       desc:"Implement a <strong>Least Recently Used Cache</strong> with O(1) get and put — top-5 most asked backend interview question at FAANG.",
       input:"LRUCache(2) → put(1,1), put(2,2), get(1)→1, put(3,3) evicts 2",output:"get(2) → -1 (evicted)",
       code:`class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // insertion-ordered
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // refresh to most-recent
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // evict LRU
    }
    this.cache.set(key, value);
  }
}`,
       time:"O(1) get/put",space:"O(capacity)"},
      {title:"Rate Limiter — Token Bucket",diff:"medium",lang:"JavaScript",
       desc:"Implement a <strong>token bucket rate limiter</strong> — used by Stripe, AWS API Gateway, and most production systems.",
       input:"new RateLimiter(5, 1000) → 5 requests/second",output:"true×5 then false until tokens replenish",
       code:`class RateLimiter {
  constructor(maxTokens, windowMs) {
    this.max = maxTokens;
    this.tokens = maxTokens;
    this.last = Date.now();
    this.windowMs = windowMs;
  }
  refill() {
    const elapsed = Date.now() - this.last;
    const add = Math.floor((elapsed / this.windowMs) * this.max);
    if (add > 0) {
      this.tokens = Math.min(this.max, this.tokens + add);
      this.last = Date.now();
    }
  }
  allow() {
    this.refill();
    if (this.tokens > 0) { this.tokens--; return true; }
    return false;
  }
}`,
       time:"O(1)",space:"O(1)"},
    ],
    tips:[
      "Always discuss trade-offs — never present a single option; interviewers want to see you reason about the design space.",
      "Mention EXPLAIN ANALYZE for database performance — it signals you actually tune queries, not just write them.",
      "Bring up CAP theorem naturally when discussing distributed databases.",
      "Connection pooling is often overlooked — mention it for high-throughput database access.",
      "For API design, discuss backward compatibility and versioning strategy — it shows product engineering maturity.",
    ]
  },
  {
    id:"devops",icon:"🚀",name:"DevOps Engineer",color:"#f0c060",
    desc:"CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring, and SRE principles. Covers AWS, Terraform, and production reliability.",
    topics:["Docker","Kubernetes","CI/CD","Monitoring & SRE"],
    qa:[
      {topic:"Docker",items:[
        {q:"Docker image vs container — what's the difference?",diff:"easy",
         a:"A Docker image is a read-only, layered filesystem snapshot built from a Dockerfile. A container is a running instance of an image — it adds a writable layer on top. One image can spawn many containers.\n\nContainers share the host OS kernel (unlike VMs which run full guest OSes), making them lightweight and fast to start. The layered filesystem means shared base layers are cached — stored only once.",
         tip:""},
        {q:"Explain Docker multi-stage builds.",diff:"medium",
         a:"Multi-stage builds use multiple FROM instructions in one Dockerfile. Each stage can selectively copy artifacts from previous stages, discarding all build tooling.\n\nExample: Stage 1 (builder): npm ci + build. Stage 2 (runner): Alpine base + copy only dist/ + node_modules. Result: 800MB build image → ~60MB production image. Benefits: smaller attack surface, faster deploys, smaller registry storage.",
         tip:""},
        {q:"How do you secure a Docker container in production?",diff:"hard",
         a:"(1) Run as non-root user (USER directive). (2) Use minimal base images (Alpine, distroless). (3) Never store secrets in Dockerfile — use secrets managers. (4) Set read-only filesystem where possible. (5) Drop Linux capabilities — --cap-drop ALL, add only what's needed. (6) Scan images with Trivy or Snyk in CI. (7) Multi-stage builds to exclude build tools from final image.",
         tip:""},
      ]},
      {topic:"Kubernetes",items:[
        {q:"Explain Deployment vs StatefulSet vs DaemonSet.",diff:"medium",
         a:"Deployment: stateless pods — rolling updates, rollbacks, scaling. Pods are interchangeable.\n\nStatefulSet: stateful workloads (databases, Kafka). Pods get stable network identities (pod-0, pod-1), persistent volume claims that survive restarts, ordered graceful scaling.\n\nDaemonSet: one pod per node — for log collectors (Fluentd), metrics agents (Datadog), network plugins.",
         tip:"Quick rule: API server → Deployment. Postgres cluster → StatefulSet. Log shipper → DaemonSet."},
        {q:"What happens when a Kubernetes Pod is OOMKilled?",diff:"hard",
         a:"OOMKilled means the container exceeded its memory limit and the Linux OOM killer terminated it. K8s restarts it based on restartPolicy.\n\nDiagnosis: kubectl describe pod → check Last State exit code 137. Review memory metrics for growth patterns. Check if limits are set too low.\n\nFixes: increase memory limits, fix memory leaks, add HPA autoscaling on memory metric, or use VPA for automatic tuning.",
         tip:"Mentioning exit code 137 specifically impresses interviewers."},
      ]},
      {topic:"CI/CD",items:[
        {q:"Continuous Delivery vs Continuous Deployment — what's the difference?",diff:"easy",
         a:"CI: build and test automatically on every commit — fast feedback.\n\nContinuous Delivery: CI + automatically prepare a deployable artifact, but a human approves production deployment.\n\nContinuous Deployment: every passing commit is automatically deployed to production with zero human gates.\n\nMost mature companies use Continuous Delivery with automated canary/blue-green deployments rather than a binary gate.",
         tip:""},
      ]},
      {topic:"Monitoring & SRE",items:[
        {q:"What are the four golden signals?",diff:"medium",
         a:"From Google's SRE book: (1) Latency — time to serve a request (distinguish successful vs failed). (2) Traffic — demand on your system (requests/sec). (3) Errors — rate of failed requests (explicit 5xx, implicit wrong content). (4) Saturation — how full your service is (CPU %, memory %, queue depth).\n\nMonitor these four and you cover the most critical failure patterns for any service.",
         tip:"Naming the SRE book signals serious study — not just tutorial-level knowledge."},
      ]},
    ],
    challenges:[
      {title:"Multi-Stage Dockerfile for Node.js",diff:"easy",lang:"Dockerfile",
       desc:"Write a production-ready <strong>multi-stage Dockerfile</strong> optimized for size, security (non-root), and build layer caching.",
       input:"Node.js Express app with package.json",output:"Secure ~80MB production image",
       code:`# Stage 1: production dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: minimal production image
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
       time:"N/A",space:"~80MB final"},
    ],
    tips:[
      "Reference the '4 golden signals' — latency, traffic, errors, saturation — in every monitoring discussion.",
      "Distinguish resource requests vs limits in Kubernetes — they serve very different purposes.",
      "Mention DORA metrics (deploy frequency, lead time, MTTR, change failure rate) in CI/CD discussions.",
      "Infrastructure as Code is expected at senior level — demonstrate Terraform or Pulumi familiarity.",
      "Blue-green = all-or-nothing switch; canary = progressive rollout. Know the blast radius difference.",
    ]
  },
  {
    id:"data",icon:"📊",name:"Data Scientist",color:"#ff6b6b",
    desc:"Statistics, ML algorithms, model evaluation, SQL, and practical ML system design from startups to research-heavy companies.",
    topics:["Statistics","Machine Learning","Model Evaluation","SQL & Analytics"],
    qa:[
      {topic:"Statistics",items:[
        {q:"What does p < 0.05 actually mean?",diff:"medium",
         a:"The p-value is the probability of observing results at least as extreme as those observed, assuming H₀ is true. It is NOT the probability that H₀ is false.\n\np < 0.05 means: if H₀ were true, we'd see this result by chance less than 5% of the time. It does NOT mean the effect is large or important. Effect size (Cohen's d) and confidence intervals tell you more than the p-value alone.",
         tip:"Knowing the common misinterpretations scores major points — most candidates recite a definition without understanding it."},
        {q:"What is the bias-variance trade-off?",diff:"medium",
         a:"Bias: error from overly simplistic assumptions — high bias → underfitting. Variance: sensitivity to training data fluctuations — high variance → overfitting.\n\nTotal Error = Bias² + Variance + Irreducible Noise. As model complexity increases: bias decreases, variance increases. Regularization reduces variance. More data reduces variance. Simpler models increase bias but reduce variance.",
         tip:""},
        {q:"Explain the Central Limit Theorem and its importance.",diff:"medium",
         a:"The CLT states that the distribution of sample means approaches normal as sample size increases, regardless of the population distribution — given independent, identically distributed samples.\n\nWhy it matters: it's the mathematical foundation for hypothesis testing, confidence intervals, and A/B testing. It's why z-tests and t-tests work even when underlying data isn't normal, as long as n ≥ ~30.",
         tip:""},
      ]},
      {topic:"Machine Learning",items:[
        {q:"Explain gradient descent: batch, mini-batch, stochastic.",diff:"medium",
         a:"GD updates parameters by stepping in the direction of the negative gradient of the loss.\n\nBatch GD: entire dataset per update — accurate but slow for large data. SGD: one sample per update — fast, noisy, can escape local minima. Mini-batch (32–256 samples): the practical default — balances accuracy and GPU efficiency.\n\nAdaptive optimizers (Adam, RMSprop) adjust per-parameter learning rates — preferred in deep learning.",
         tip:""},
        {q:"How do you handle a severely imbalanced classification dataset?",diff:"hard",
         a:"Solutions: (1) Resampling — oversample minority with SMOTE or undersample majority. (2) Class weights — increase penalty for misclassifying minority. (3) Threshold tuning — don't blindly use 0.5; optimize for your F1/recall target. (4) Better metrics — use F1, PR-AUC, or ROC-AUC, never accuracy alone. (5) Anomaly detection framing for extreme ratios (>100:1).",
         tip:""},
      ]},
      {topic:"Model Evaluation",items:[
        {q:"What is data leakage and why is it critical to prevent?",diff:"hard",
         a:"Data leakage: information outside the training set influences model training, producing optimistic evaluation metrics that don't generalize to production.\n\nTypes: (1) Target leakage — a feature is a proxy for the target. (2) Train-test contamination — scaling, imputation, or feature selection done before the split.\n\nPrevention: always split BEFORE preprocessing, use sklearn Pipelines, use time-based splits for temporal data.",
         tip:"Mentioning this proactively signals senior-level thinking."},
      ]},
      {topic:"SQL & Analytics",items:[
        {q:"Explain window functions with a real use case.",diff:"medium",
         a:"Window functions calculate across rows related to the current row without collapsing them (unlike GROUP BY). The OVER() clause defines the window.\n\nKey functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER(), NTILE().\n\nUse case: find top 3 highest-paid employees per department → DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) then WHERE rank <= 3.",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"K-Means from Scratch",diff:"hard",lang:"Python",
       desc:"Implement <strong>K-Means clustering</strong> without sklearn — assignment step, update step, and convergence check.",
       input:"points=[[1,2],[1,4],[10,2],[10,4]], k=2",output:"Two clusters: left group and right group",
       code:`import numpy as np

def kmeans(X, k, max_iters=100, tol=1e-4):
    # Random initialisation
    idx = np.random.choice(len(X), k, replace=False)
    centroids = X[idx].copy()

    for _ in range(max_iters):
        # Assignment: each point → nearest centroid
        dists = np.linalg.norm(X[:, np.newaxis] - centroids, axis=2)
        labels = np.argmin(dists, axis=1)

        # Update: recompute centroids
        new_c = np.array([X[labels == i].mean(axis=0) for i in range(k)])

        if np.linalg.norm(new_c - centroids) < tol:
            break  # converged
        centroids = new_c

    return labels, centroids`,
       time:"O(n·k·iterations)",space:"O(n·k)"},
    ],
    tips:[
      "Always ask about the business metric before choosing an ML metric — interviewers want product thinking.",
      "Mention data leakage proactively in evaluation discussions — it separates junior from senior candidates.",
      "For A/B testing: discuss power, minimum detectable effect, sample size, and novelty effects.",
      "L1 vs L2: L1 produces sparse weights (feature selection); L2 shrinks all weights proportionally.",
      "SQL is still expected — practice window functions, CTEs, and self-joins.",
    ]
  },
  {
    id:"security",icon:"🛡️",name:"Cybersecurity Analyst",color:"#ff6b6b",
    desc:"OWASP Top 10, threat modeling, incident response, cryptography, network security, and cloud security architecture patterns.",
    topics:["OWASP Top 10","Cryptography","Network Security","Incident Response"],
    qa:[
      {topic:"OWASP Top 10",items:[
        {q:"Explain SQL Injection and how to prevent it.",diff:"easy",
         a:"SQL injection occurs when user input is concatenated into SQL queries, allowing attackers to manipulate query logic or extract data.\n\nExample: WHERE name='' OR '1'='1' bypasses authentication. Prevention: (1) Parameterized queries / prepared statements — always. (2) ORM with built-in parameterization. (3) Input validation and allowlisting. (4) Least-privilege DB accounts. (5) WAF as defense-in-depth only.",
         tip:""},
        {q:"What is CSRF and how does SameSite cookie attribute help?",diff:"medium",
         a:"CSRF tricks authenticated users into submitting requests to a site they're logged into from a malicious page — the browser automatically sends session cookies.\n\nPrevention: (1) CSRF tokens — per-session secret in forms, verified server-side. (2) SameSite=Strict: cookie only sent on same-site requests. SameSite=Lax: sent on top-level GET navigations. (3) Verify Origin/Referer headers for state-changing operations.",
         tip:""},
        {q:"Explain XSS types and prevention.",diff:"medium",
         a:"XSS allows attackers to inject scripts that execute in victims' browsers.\n\nStored XSS: script saved in DB, served to all users. Reflected XSS: script in URL parameter reflected in response. DOM-based XSS: client-side JS modifies DOM unsafely.\n\nPrevention: (1) Context-aware output encoding. (2) Content Security Policy (CSP) header. (3) Use frameworks that auto-escape (React, Vue). (4) HttpOnly cookies to prevent script-based theft.",
         tip:""},
      ]},
      {topic:"Cryptography",items:[
        {q:"Hashing vs encryption vs encoding — explain all three.",diff:"medium",
         a:"Encoding: transforms data format for compatibility (Base64, URL) — NOT security, easily reversed, no key needed.\n\nHashing: one-way irreversible transformation. For passwords (bcrypt, Argon2 with salt), data integrity (SHA-256 in HMAC).\n\nEncryption: two-way with a key. Symmetric (AES-256): same key for both. Asymmetric (RSA/ECC): public key encrypts, private decrypts.\n\nFor passwords: ALWAYS hash with bcrypt/Argon2, NEVER encrypt.",
         tip:""},
      ]},
      {topic:"Network Security",items:[
        {q:"IDS vs IPS — what's the difference?",diff:"medium",
         a:"IDS (Intrusion Detection System): passive monitoring — analyzes traffic and generates alerts but does NOT block anything.\n\nIPS (Intrusion Prevention System): inline monitoring — actively blocks malicious traffic in real time. Risk: false positives can block legitimate traffic.\n\nModern NGFWs combine both. NIDS/NIPS monitors network traffic; HIDS/HIPS monitors the host itself. Defense-in-depth uses both.",
         tip:""},
      ]},
      {topic:"Incident Response",items:[
        {q:"What are the phases of incident response?",diff:"medium",
         a:"NIST SP 800-61 lifecycle: (1) Preparation — policies, playbooks, tooling, team training. (2) Detection & Analysis — identify IoCs, scope and classify severity. (3) Containment — isolate affected systems (short then long-term). (4) Eradication — remove malware, close vectors, patch. (5) Recovery — restore, validate, monitor for reinfection. (6) Lessons Learned — post-incident review, update playbooks.",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"Secure Password Hashing with bcrypt",diff:"medium",lang:"Node.js",
       desc:"Implement <strong>password hashing and verification</strong> correctly. Never store plaintext or MD5/SHA1 passwords.",
       input:'password = "hunter2"',output:"bcrypt hash; verify returns true/false",
       code:`const bcrypt = require('bcrypt');
const ROUNDS = 12; // 2^12 iterations — tune for your CPU

// Registration
async function hashPassword(plaintext) {
  // bcrypt auto-generates & embeds a unique salt
  return bcrypt.hash(plaintext, ROUNDS);
  // result: "$2b$12$<22-char-salt><31-char-hash>"
}

// Login
async function verifyPassword(plaintext, storedHash) {
  // constant-time compare — prevents timing attacks
  return bcrypt.compare(plaintext, storedHash);
}

// ✗ NEVER do this:
// crypto.createHash('md5').update(pwd).digest('hex')
// MD5 is fast → 10 billion guesses/sec on GPU`,
       time:"O(2^rounds)",space:"O(1)"},
    ],
    tips:[
      "Always mention 'defense in depth' — no single control is sufficient.",
      "Know the difference between vulnerability, threat, risk, and exploit — interviewers test this vocabulary.",
      "For cloud security: shared responsibility model, IAM least privilege, encryption at rest vs in transit.",
      "Know STRIDE: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege.",
      "IR lifecycle: Preparation → Detection → Containment → Eradication → Recovery → Lessons learned.",
    ]
  },
  {
    id:"cloud",icon:"☁️",name:"Cloud Architect",color:"#00d4aa",
    desc:"AWS, Azure, GCP architecture patterns, cost optimization, high availability, disaster recovery, and cloud-native design at scale.",
    topics:["AWS Core Services","High Availability","Cost Optimization","Serverless"],
    qa:[
      {topic:"AWS Core Services",items:[
        {q:"Compare EC2, ECS, EKS, and Lambda.",diff:"medium",
         a:"EC2: raw VMs — full control, pay for idle. ECS: managed container orchestration, AWS manages control plane. EKS: managed Kubernetes — more portable, richer ecosystem. Lambda: serverless, pay per invocation, scale to zero, cold starts.\n\nDecision: Need control? EC2. Containers AWS-native? ECS Fargate. Need K8s portability? EKS. Event-driven? Lambda. Most new workloads start with ECS Fargate.",
         tip:""},
        {q:"Explain S3 storage classes.",diff:"medium",
         a:"Standard: frequent access, 99.99% availability. Intelligent-Tiering: auto-moves based on patterns — best for unpredictable access. Standard-IA: infrequent access — lower storage, retrieval fee. Glacier Instant: archive with ms retrieval. Deep Archive: lowest cost, 12hr retrieval.\n\nLifecycle policies automate transitions: Standard → IA (30d) → Glacier (90d) → Deep Archive (1yr) → Expire.",
         tip:""},
      ]},
      {topic:"High Availability",items:[
        {q:"Design a highly available web application on AWS.",diff:"hard",
         a:"Core pattern: Route 53 (health checks + failover) → CloudFront (CDN + WAF) → ALB across 2+ AZs → Auto Scaling Group → RDS Multi-AZ → ElastiCache → S3 for static assets.\n\nFor 99.99% SLA: multi-region with Route 53 latency routing + cross-region RDS read replicas + AWS Global Accelerator for anycast edge.",
         tip:""},
      ]},
      {topic:"Cost Optimization",items:[
        {q:"What are the main AWS cost optimization strategies?",diff:"medium",
         a:"(1) Right-size compute via CloudWatch metrics + Compute Optimizer recommendations. (2) Reserved Instances / Savings Plans: 1–3yr commitment = 30–70% savings on predictable workloads. (3) Spot Instances: 90% cheaper for fault-tolerant workloads. (4) Auto Scaling to zero at night. (5) S3 Lifecycle Policies for cold data. (6) Keep traffic within regions/AZs — cross-region data transfer adds up fast.",
         tip:""},
      ]},
      {topic:"Serverless",items:[
        {q:"What are the trade-offs of Lambda/serverless architecture?",diff:"medium",
         a:"Pros: no server management, scale to zero (cost-efficient for spiky traffic), pay per invocation, built-in HA.\n\nCons: cold starts (100ms–2s), 15-min max execution, stateless (external state required), harder local debugging, vendor lock-in.\n\nBest for: event-driven, scheduled jobs, variable-traffic APIs, webhooks. Avoid for: long-running processes or consistent high-throughput (always-on is cheaper at scale).",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"S3 Event-Driven Lambda Pipeline",diff:"medium",lang:"Python",
       desc:"Write a Lambda handler for a <strong>serverless image processing pipeline</strong>: S3 upload → resize → store thumbnail → SNS notify.",
       input:"S3 PutObject event (image.jpg)",output:"200px thumbnail stored + SNS notification",
       code:`import boto3, io
from PIL import Image

s3  = boto3.client('s3')
sns = boto3.client('sns')

def handler(event, context):
    rec    = event['Records'][0]
    bucket = rec['s3']['bucket']['name']
    key    = rec['s3']['object']['key']

    body = s3.get_object(Bucket=bucket, Key=key)['Body'].read()
    img  = Image.open(io.BytesIO(body))
    img.thumbnail((200, 200), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=85)
    thumb = f'thumbs/{key}'
    s3.put_object(Bucket=bucket, Key=thumb,
                  Body=buf.getvalue(), ContentType='image/jpeg')

    sns.publish(TopicArn='arn:aws:sns:...:Done',
               Message=f'Ready: {thumb}')
    return {'statusCode': 200}`,
       time:"O(pixels)",space:"O(image size)"},
    ],
    tips:[
      "Always discuss costs — architects are expected to optimize spend, not just build for performance.",
      "Know the Well-Architected Framework 6 pillars: Operational Excellence, Security, Reliability, Performance, Cost, Sustainability.",
      "For any design, mention observability: CloudWatch metrics, X-Ray tracing, custom dashboards.",
      "IAM best practices: least privilege, roles over users, resource-based vs identity-based policies.",
      "Know when Aurora wins over RDS — 5x performance, shared storage, multi-master are key differentiators.",
    ]
  },
  {
    id:"ml",icon:"🤖",name:"ML Engineer",color:"#a78bff",
    desc:"Production ML systems, MLOps, model serving, feature engineering, training pipelines, and LLMs in the real world.",
    topics:["MLOps","Model Serving","Feature Engineering","LLMs & GenAI"],
    qa:[
      {topic:"MLOps",items:[
        {q:"What is a feature store and why does it matter?",diff:"medium",
         a:"A feature store is a centralized repository for computing, storing, and serving ML features consistently.\n\nBenefits: (1) No duplicate feature engineering code. (2) Training-serving consistency — prevents skew from different code paths. (3) Point-in-time correct retrieval — prevents temporal leakage. (4) Online (low-latency) and offline (batch) serving from the same source.\n\nTools: Feast (open source), Tecton, Vertex AI Feature Store, SageMaker Feature Store.",
         tip:""},
        {q:"How do you detect and handle training-serving skew?",diff:"hard",
         a:"Training-serving skew: model performs well offline but degrades in production because feature distributions differ.\n\nDetection: (1) Log raw model inputs in production. (2) Compare distributions using KS test or PSI. (3) Monitor prediction distributions — sudden shifts signal skew. (4) Shadow mode before full launch.\n\nPrevention: use the same feature pipeline code for training and serving — a feature store solves this elegantly.",
         tip:""},
      ]},
      {topic:"Model Serving",items:[
        {q:"Explain shadow mode, canary, and A/B deployment strategies.",diff:"hard",
         a:"Shadow mode: new model runs in parallel, predictions logged but never shown to users — zero risk, catches bugs before launch.\n\nCanary: route small % traffic (1–5%) to new model, increase gradually.\n\nA/B test: statistically rigorous randomized experiment requiring sample size calculation and significance testing.\n\nRecommended flow: Shadow → Canary → A/B Test → Full rollout. Shadow mode first to catch silent failures.",
         tip:""},
      ]},
      {topic:"Feature Engineering",items:[
        {q:"What are the most impactful feature engineering techniques?",diff:"medium",
         a:"Numerical: normalization/standardization, log transforms for skewed distributions, polynomial features, binning.\n\nCategorical: one-hot encoding (low cardinality), target encoding (high cardinality), learned embeddings for DL.\n\nTemporal: lag features, rolling statistics, time-since-event, cyclical encoding (sin/cos for hour/day periodicity).\n\nAlways: handle missing values deliberately, treat outliers, validate no data leakage.",
         tip:""},
      ]},
      {topic:"LLMs & GenAI",items:[
        {q:"RAG vs fine-tuning — when do you choose each?",diff:"medium",
         a:"RAG retrieves relevant documents at inference time and injects them into the prompt context. Use RAG when: knowledge changes frequently, you need citations, knowledge is proprietary, or compute budget is limited.\n\nFine-tuning trains model weights on your data. Use when: you need a specific style/persona, the task is highly specialized, or you need lower latency at very high volume.\n\nBest practice: start with RAG, then fine-tune on top if quality is still insufficient.",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"Cosine Similarity for Embeddings",diff:"medium",lang:"Python",
       desc:"Implement <strong>cosine similarity</strong> from scratch — core measure in embedding search, recommendations, and RAG retrieval.",
       input:"v1=[1,0,1], v2=[0,1,1]",output:"similarity ≈ 0.5",
       code:`import numpy as np

def cosine_similarity(v1, v2):
    """cos(θ) = dot(v1,v2) / (‖v1‖·‖v2‖)  range: [-1, 1]"""
    v1, v2 = np.array(v1, dtype=float), np.array(v2, dtype=float)
    denom = np.linalg.norm(v1) * np.linalg.norm(v2)
    return 0.0 if denom == 0 else float(np.dot(v1, v2) / denom)

# Vectorised batch version (for vector DB lookups)
def top_k_similar(query, corpus, k=5):
    q = query / np.linalg.norm(query)
    C = corpus / np.linalg.norm(corpus, axis=1, keepdims=True)
    scores = C @ q               # O(n·d)
    idx    = np.argsort(scores)[::-1][:k]
    return idx, scores[idx]`,
       time:"O(d) single, O(n·d) batch",space:"O(1)"},
    ],
    tips:[
      "Monitor model drift and data drift separately — different root causes and remediation strategies.",
      "For LLM interviews: know prompt engineering patterns — few-shot, chain-of-thought, ReAct agent loops.",
      "MLflow and Weights & Biases are standard tooling — know what experiment tracking operationally solves.",
      "Quantization and ONNX export are key for production deployment efficiency.",
      "Most asked ML system design: recommendation system. Know the two-tower model architecture.",
    ]
  },
  {
    id:"mobile",icon:"📱",name:"Mobile Developer",color:"#4ade80",
    desc:"React Native, iOS (Swift/SwiftUI), Android (Kotlin/Compose), performance optimization, and mobile-specific architecture patterns.",
    topics:["React Native","iOS","Android","Performance"],
    qa:[
      {topic:"React Native",items:[
        {q:"How does the React Native bridge work? What is JSI?",diff:"hard",
         a:"Old architecture: JS thread and Native thread communicate via an async bridge — serializing to JSON, passing across, deserializing. High-frequency operations (animations, gestures) suffer a bottleneck.\n\nNew Architecture (JSI — JavaScript Interface): JS holds a direct C++ reference to native objects, enabling synchronous direct calls without serialization. Built on this: Fabric (new renderer), TurboModules (lazy native loading), and Codegen (type-safe interfaces).",
         tip:""},
        {q:"FlatList vs ScrollView — when to use each?",diff:"easy",
         a:"ScrollView: renders all children at once. Fine for small fixed content (<20 items). Never use for lists that could grow — everything mounts regardless of visibility.\n\nFlatList: virtualized — only visible items are mounted. Unmounts off-screen items to save memory. Use getItemLayout for fixed-height items. FlashList (Shopify) is a drop-in FlatList replacement with significantly better performance using recycled views.",
         tip:""},
      ]},
      {topic:"Performance",items:[
        {q:"How do you identify and fix React Native performance issues?",diff:"medium",
         a:"Identification: Flipper + React DevTools Profiler for JS thread. Look for dropped frames (<60fps) and thread blockage.\n\nFixes: (1) Move animations to native thread: useNativeDriver: true or Reanimated 2. (2) Memoize with React.memo, useMemo, useCallback. (3) FlatList: keyExtractor, getItemLayout, windowSize, removeClippedSubviews. (4) Avoid inline styles and anonymous functions in render. (5) Hermes engine (default in RN 0.70+).",
         tip:""},
      ]},
      {topic:"iOS",items:[
        {q:"Explain ARC (Automatic Reference Counting) in Swift.",diff:"medium",
         a:"ARC tracks strong reference counts to each class instance. When count drops to zero, the instance is deallocated. ARC works at compile time (no GC pause at runtime).\n\nPitfall: retain cycles — two objects holding strong references to each other. Fix: use weak or unowned for back-references. Common pattern: [weak self] in closures, weak var delegate in delegate pattern.",
         tip:""},
      ]},
      {topic:"Android",items:[
        {q:"Explain the Android Activity lifecycle.",diff:"medium",
         a:"Key callbacks: onCreate (init, set layout) → onStart (visible) → onResume (interactive, foreground) → onPause (partially hidden) → onStop (fully hidden) → onDestroy (finishing).\n\nCritical: save state in onPause (don't assume onStop runs), release camera/sensors in onStop, use ViewModel to survive config changes (rotation recreates Activity by default).",
         tip:""},
      ]},
    ],
    challenges:[
      {title:"useDebounce Custom Hook",diff:"easy",lang:"React Native / TypeScript",
       desc:"Build a reusable <strong>useDebounce hook</strong> — used in search inputs to avoid API calls on every keystroke.",
       input:"useDebounce(searchText, 500)",output:"debounced value updates 500ms after user stops typing",
       code:`import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timer); // cleanup on change
  }, [value, delay]);

  return debounced;
}

// Usage
function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery);
  }, [debouncedQuery]);
}`,
       time:"O(1)",space:"O(1)"},
    ],
    tips:[
      "Know Expo vs bare React Native workflows and when the complexity of ejecting is justified.",
      "iOS: [weak self] in closures, async/await with Swift concurrency, and ARC retain cycle debugging.",
      "Android: ViewModel + LiveData/StateFlow lifecycle, Kotlin coroutines and their scope.",
      "App startup time: Hermes bytecode, lazy module loading, and splash screen best practices.",
      "State management: Zustand and Jotai are replacing Redux in new RN apps — know when context alone is enough.",
    ]
  },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────
function Badge({ children, color=C.accent, bg }) {
  return (
    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em",
      textTransform:"uppercase", padding:"3px 9px", borderRadius:5,
      background: bg||`${color}18`, border:`1px solid ${color}33`, color, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}
function DiffBadge({ diff }) {
  const map = { easy:C.green, medium:C.gold, hard:C.accent2 };
  return <Badge color={map[diff]||C.gold}>{diff}</Badge>;
}

function QACard({ item, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qacard" style={{ background:C.surf, border:`1px solid ${open?C.border2:C.border}`, borderRadius:14, marginBottom:10, overflow:"hidden" }}>
      <div onClick={()=>setOpen(o=>!o)} style={{ padding:"15px 18px", cursor:"pointer", display:"flex", alignItems:"flex-start", gap:10, userSelect:"none" }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.accent, background:"rgba(110,107,255,0.1)", border:"1px solid rgba(110,107,255,0.15)", padding:"2px 7px", borderRadius:4, flexShrink:0, marginTop:3 }}>Q{String(idx+1).padStart(2,"0")}</span>
        <span style={{ fontSize:"0.9rem", fontWeight:700, lineHeight:1.4, flex:1 }}>{item.q}</span>
        <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0, marginLeft:4 }}>
          <DiffBadge diff={item.diff}/>
          <span style={{ color:C.muted, fontSize:"0.7rem", transition:"transform 0.3s", transform:open?"rotate(180deg)":"none", display:"inline-block" }}>▼</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:"0 18px 16px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ paddingTop:13, fontSize:"0.86rem", color:C.muted, lineHeight:1.8, whiteSpace:"pre-line" }}>{item.a}</div>
          {item.tip && (
            <div style={{ display:"flex", gap:9, marginTop:11, background:"rgba(240,192,96,0.05)", border:"1px solid rgba(240,192,96,0.15)", borderRadius:8, padding:"10px 12px" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.gold, letterSpacing:"0.12em", textTransform:"uppercase", flexShrink:0, paddingTop:2 }}>💡 Tip</span>
              <span style={{ fontSize:"0.82rem", color:C.muted, lineHeight:1.65 }}>{item.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ ch }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:14, marginBottom:16, overflow:"hidden" }}>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span>💻</span>
          <span style={{ fontSize:"0.93rem", fontWeight:700 }}>{ch.title}</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <DiffBadge diff={ch.diff}/>
          <Badge color={C.muted} bg="rgba(255,255,255,0.04)">{ch.lang}</Badge>
        </div>
      </div>
      <div style={{ padding:"16px 18px" }}>
        <p style={{ fontSize:"0.85rem", color:C.muted, lineHeight:1.72, marginBottom:12 }} dangerouslySetInnerHTML={{__html:ch.desc}}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
          {[["Input",ch.input],["Output",ch.output]].map(([l,v])=>(
            <div key={l} style={{ background:C.surf2, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.76rem", color:C.accent3, lineHeight:1.5 }}>{v}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setOpen(o=>!o)} style={{ display:"inline-flex", alignItems:"center", gap:7, fontFamily:"'Syne',sans-serif", fontSize:"0.77rem", fontWeight:700, letterSpacing:"0.04em", background:"rgba(110,107,255,0.1)", border:"1px solid rgba(110,107,255,0.2)", color:C.accent, padding:"7px 14px", borderRadius:8, transition:"all 0.2s" }}>
          {open?"▼ Hide Solution":"▶ Show Solution"}
        </button>
        {open && (
          <div style={{ marginTop:11 }}>
            <div style={{ background:"#0a0a14", border:`1px solid ${C.border2}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"8px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:5 }}>
                  {["#ff5f56","#ffbd2e","#27c93f"].map(col=><div key={col} style={{ width:9,height:9,borderRadius:"50%",background:col }}/>)}
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted }}>{ch.lang}</span>
              </div>
              <pre dangerouslySetInnerHTML={{__html:ch.code}}/>
            </div>
            <div style={{ display:"flex", gap:7, marginTop:8, flexWrap:"wrap" }}>
              {[["Time",ch.time],["Space",ch.space]].map(([k,v])=>(
                <span key={k} style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.63rem", padding:"3px 9px", borderRadius:5, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, color:C.muted }}>
                  {k}: <span style={{ color:C.text }}>{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR CONTENT ─────────────────────────────────────────
function SidebarContent({ role, activeTopic, onTopicClick, onJumpTo }) {
  return (
    <div style={{ padding:"18px 0" }}>
      <div style={{ padding:"0 14px 10px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:7, paddingLeft:4 }}>Topics</div>
        {role.topics.map(t => {
          const count = role.qa.find(s=>s.topic===t)?.items.length||0;
          const active = activeTopic===t;
          return (
            <div key={t} onClick={()=>onTopicClick(t)}
              style={{ display:"flex", alignItems:"center", padding:"9px 10px", borderRadius:8, cursor:"pointer", fontSize:"0.81rem", fontWeight:600, marginBottom:2, background:active?"rgba(110,107,255,0.1)":"transparent", border:`1px solid ${active?"rgba(110,107,255,0.22)":"transparent"}`, color:active?C.accent:C.text, transition:"all 0.2s" }}>
              <span style={{ flex:1 }}>{t}</span>
              {count>0 && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted }}>{count}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ height:1, background:C.border, margin:"6px 14px 10px" }}/>
      <div style={{ padding:"0 14px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:7, paddingLeft:4 }}>Jump to</div>
        {[["coding","💻 Coding Challenges"],["tips","🎯 Interview Tips"]].map(([id,lbl])=>(
          <div key={id} onClick={()=>onJumpTo(id)}
            style={{ padding:"9px 10px", borderRadius:8, cursor:"pointer", fontSize:"0.81rem", fontWeight:600, marginBottom:2, color:C.muted, transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {lbl}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROLE PAGE ────────────────────────────────────────────────
function RolePage({ role, onBack }) {
  const [tab, setTab] = useState("qa");
  const [activeTopic, setActiveTopic] = useState(role.topics[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const topicRefs = useRef({});
  const totalQ = role.qa.reduce((s,t)=>s+t.items.length,0);

  useEffect(()=>{ window.scrollTo(0,0); setDrawerOpen(false); },[role]);

  const goToTopic = (t) => {
    setActiveTopic(t); setTab("qa"); setDrawerOpen(false);
    setTimeout(()=>{
      topicRefs.current[t]?.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 80);
  };
  const jumpTo = (id) => { setTab(id); setDrawerOpen(false); window.scrollTo({top:220,behavior:"smooth"}); };

  return (
    <div style={{ paddingTop:70, minHeight:"100vh", background:C.bg }}>
      {/* Header */}
      <div style={{ padding:"28px 22px 24px", borderBottom:`1px solid ${C.border}`, background:"linear-gradient(180deg,rgba(110,107,255,0.06) 0%,transparent 100%)" }}>
        <button onClick={onBack}
          style={{ display:"inline-flex", alignItems:"center", gap:7, background:"none", border:"none", color:C.muted, fontFamily:"'Syne',sans-serif", fontSize:"0.76rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:18, padding:0, transition:"color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.color=C.text} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
          ← Back to All Roles
        </button>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
          <div style={{ width:52, height:52, borderRadius:13, background:"rgba(110,107,255,0.12)", border:"1px solid rgba(110,107,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>{role.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.5rem,5vw,2.3rem)", letterSpacing:"-0.02em", lineHeight:1.1 }}>{role.name}</h1>
            <p style={{ color:C.muted, fontSize:"0.85rem", lineHeight:1.65, marginTop:5, maxWidth:600 }}>{role.desc}</p>
            <div style={{ display:"flex", gap:7, marginTop:10, flexWrap:"wrap" }}>
              <Badge color={C.accent}>📋 {totalQ} Questions</Badge>
              <Badge color={C.accent3}>💻 {role.challenges.length} Challenges</Badge>
              <Badge color={C.gold}>🎯 {role.topics.length} Topics</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar trigger */}
      <button className="mob-sidebar-btn" onClick={()=>setDrawerOpen(true)}
        style={{ display:"flex", width:"100%", background:C.surf, border:"none", borderBottom:`1px solid ${C.border}`, padding:"11px 18px", cursor:"pointer", color:C.text, fontFamily:"'Syne',sans-serif", fontSize:"0.8rem", fontWeight:700, alignItems:"center", justifyContent:"space-between" }}>
        <span>☰ Topics & Navigation</span><span style={{ color:C.muted }}>▼</span>
      </button>

      {/* Mobile drawer */}
      <div className={`mob-overlay${drawerOpen?" show":""}`} onClick={()=>setDrawerOpen(false)}/>
      <div className={`mob-drawer${drawerOpen?" show":""}`}>
        <div style={{ padding:"12px 14px 6px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"0.8rem", fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Navigate</span>
          <button onClick={()=>setDrawerOpen(false)} style={{ background:"none", border:"none", color:C.muted, fontSize:"1rem", cursor:"pointer" }}>✕</button>
        </div>
        <SidebarContent role={role} activeTopic={activeTopic} onTopicClick={goToTopic} onJumpTo={jumpTo}/>
      </div>

      <div style={{ display:"flex" }}>
        {/* Desktop sidebar */}
        <div className="sidebar-desk">
          <SidebarContent role={role} activeTopic={activeTopic} onTopicClick={goToTopic} onJumpTo={jumpTo}/>
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:"22px 18px", minWidth:0, maxWidth:"100%" }}>
          {/* Tabs */}
          <div style={{ display:"flex", gap:3, marginBottom:22, background:C.surf, border:`1px solid ${C.border}`, borderRadius:10, padding:3, width:"fit-content", flexWrap:"wrap" }}>
            {[["qa","Q & A"],["coding","Coding"],["tips","Tips"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{ padding:"7px 15px", borderRadius:7, fontSize:"0.79rem", fontWeight:700, border:"none", background:tab===id?C.accent:"transparent", color:tab===id?"#fff":C.muted, transition:"all 0.2s", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Q&A tab */}
          {tab==="qa" && (
            <div className="fu">
              {role.qa.map(section=>(
                <div key={section.topic} ref={el=>topicRefs.current[section.topic]=el} style={{ scrollMarginTop:80 }}>
                  <div style={{ marginBottom:14, paddingTop:4 }}>
                    <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.2rem,3vw,1.65rem)", letterSpacing:"-0.02em", marginBottom:3 }}>{section.topic}</h2>
                    <p style={{ fontSize:"0.8rem", color:C.muted }}>{section.items.length} questions covering core concepts asked in real interviews.</p>
                  </div>
                  {section.items.map((item,i)=><QACard key={i} item={item} idx={i}/>)}
                  <div style={{ height:20 }}/>
                </div>
              ))}
            </div>
          )}

          {/* Coding tab */}
          {tab==="coding" && (
            <div className="fu">
              <div style={{ marginBottom:18 }}>
                <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.2rem,3vw,1.65rem)", letterSpacing:"-0.02em", marginBottom:3 }}>Coding Challenges</h2>
                <p style={{ fontSize:"0.8rem", color:C.muted }}>Hands-on problems asked in technical screens. Understand the pattern, not just the answer.</p>
              </div>
              {role.challenges.map((ch,i)=><ChallengeCard key={i} ch={ch}/>)}
            </div>
          )}

          {/* Tips tab */}
          {tab==="tips" && (
            <div className="fu">
              <div style={{ marginBottom:18 }}>
                <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.2rem,3vw,1.65rem)", letterSpacing:"-0.02em", marginBottom:3 }}>Interview Tips</h2>
                <p style={{ fontSize:"0.8rem", color:C.muted }}>Insider advice from engineers who've interviewed at top companies for this role.</p>
              </div>
              {role.tips.map((tip,i)=>(
                <div key={i} style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:12, marginBottom:9, padding:"14px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:C.gold, background:"rgba(240,192,96,0.1)", border:"1px solid rgba(240,192,96,0.2)", padding:"2px 7px", borderRadius:4, flexShrink:0, marginTop:2 }}>TIP {String(i+1).padStart(2,"0")}</span>
                  <span style={{ fontSize:"0.86rem", color:C.muted, lineHeight:1.72 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ onSelectRole }) {
  const rolesRef = useRef(null);
  const scrollToRoles = () => rolesRef.current?.scrollIntoView({ behavior:"smooth" });

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"100px 20px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:480, height:480, background:"radial-gradient(circle,rgba(110,107,255,0.14) 0%,transparent 70%)", top:-80, left:"50%", transform:"translateX(-50%)", borderRadius:"50%", filter:"blur(60px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(110,107,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(110,107,255,0.04) 1px,transparent 1px)`, backgroundSize:"60px 60px", maskImage:"radial-gradient(ellipse 80% 70% at 50% 50%,black 20%,transparent 100%)", pointerEvents:"none" }}/>

        <div className="fu" style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.66rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.accent, background:"rgba(110,107,255,0.1)", border:"1px solid rgba(110,107,255,0.22)", padding:"5px 14px", borderRadius:100, marginBottom:20, position:"relative", zIndex:2 }}>
          🎯 Real Questions · Real Answers · Real Jobs
        </div>
        <h1 className="fu1" style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(2.6rem,9vw,6.2rem)", lineHeight:1.0, letterSpacing:"-0.03em", maxWidth:860, position:"relative", zIndex:2 }}>
          Ace Every<br/>
          <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#6e6bff 0%,#a78bff 50%,#ff6b6b 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>IT Interview</em><br/>
          You Walk Into
        </h1>
        <p className="fu2" style={{ fontSize:"clamp(0.92rem,2vw,1.05rem)", color:C.muted, maxWidth:500, lineHeight:1.72, marginTop:18, position:"relative", zIndex:2 }}>
          Role-specific Q&A banks and coding challenges from real interviews at top tech companies. Pick your role, study smart, land the offer.
        </p>
        <div className="fu3" style={{ display:"flex", gap:10, marginTop:28, position:"relative", zIndex:2, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={scrollToRoles}
            style={{ background:C.accent, color:"#fff", padding:"12px 26px", borderRadius:10, border:"none", fontSize:"0.87rem", fontWeight:700, transition:"all 0.2s" }}
            onMouseEnter={e=>Object.assign(e.currentTarget.style,{transform:"translateY(-2px)",boxShadow:"0 12px 36px rgba(110,107,255,.4)",background:"#8886ff"})}
            onMouseLeave={e=>Object.assign(e.currentTarget.style,{transform:"none",boxShadow:"none",background:C.accent})}>
            Explore All Roles →
          </button>
          <button onClick={()=>onSelectRole("frontend")}
            style={{ background:"transparent", color:C.text, padding:"12px 22px", borderRadius:10, border:`1px solid ${C.border2}`, fontSize:"0.87rem", fontWeight:600, transition:"all 0.2s" }}
            onMouseEnter={e=>Object.assign(e.currentTarget.style,{borderColor:C.accent,color:C.accent})}
            onMouseLeave={e=>Object.assign(e.currentTarget.style,{borderColor:C.border2,color:C.text})}>
            See Sample Q&A
          </button>
        </div>
        {/* Stats */}
        <div className="fu4" style={{ display:"flex", marginTop:48, border:`1px solid ${C.border}`, borderRadius:14, background:C.surf, overflow:"hidden", position:"relative", zIndex:2, flexWrap:"wrap", justifyContent:"center" }}>
          {[["8","Roles"],["120+","Questions"],["20+","Challenges"],["5","Tips/Role"]].map(([n,l],i,arr)=>(
            <div key={l} style={{ padding:"16px 26px", borderRight:i<arr.length-1?`1px solid ${C.border}`:"none", textAlign:"center" }}>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"1.7rem", lineHeight:1, background:`linear-gradient(135deg,${C.text},${C.muted})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{n}</div>
              <div style={{ fontSize:"0.63rem", color:C.muted, marginTop:3, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <div style={{ overflow:"hidden", background:C.surf, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"10px 0" }}>
        <div className="ticker-t">
          {[...ROLES,...ROLES].map((r,i)=>(
            <div key={i} style={{ padding:"0 24px", fontFamily:"'DM Mono',monospace", fontSize:"0.66rem", color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap", borderRight:`1px solid ${C.border}` }}>
              <span style={{ color:C.accent, marginRight:7 }}>✦</span>{r.name}
            </div>
          ))}
        </div>
      </div>

      {/* Roles grid */}
      <div ref={rolesRef} style={{ padding:"60px 20px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.64rem", color:C.accent, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>// choose your path</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.7rem,4vw,2.9rem)", letterSpacing:"-0.02em", marginBottom:32 }}>Browse by <span style={{ fontStyle:"italic", color:C.muted }}>Role</span></h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:10 }}>
          {ROLES.map(r=>{
            const tq = r.qa.reduce((s,t)=>s+t.items.length,0);
            return (
              <div key={r.id} className="rcard" onClick={()=>onSelectRole(r.id)}
                style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:13, padding:"18px 15px", position:"relative", overflow:"hidden" }}
                onMouseEnter={e=>Object.assign(e.currentTarget.style,{borderColor:`${r.color}55`,boxShadow:`0 16px 46px ${r.color}22`})}
                onMouseLeave={e=>Object.assign(e.currentTarget.style,{borderColor:C.border,boxShadow:"none"})}>
                <div style={{ width:36,height:36,borderRadius:9,background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.05rem",marginBottom:12 }}>{r.icon}</div>
                <div style={{ fontSize:"0.84rem", fontWeight:700, marginBottom:4, lineHeight:1.3 }}>{r.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:C.muted }}>{tq}q · {r.challenges.length} challenges</div>
                <div style={{ position:"absolute", top:14, right:14, color:C.muted, fontSize:"0.8rem", opacity:0.6 }}>↗</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:"0 20px 60px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.64rem", color:C.accent, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>// the process</div>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.7rem,4vw,2.9rem)", letterSpacing:"-0.02em", marginBottom:32 }}>How It <span style={{ fontStyle:"italic", color:C.muted }}>Works</span></h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:2, background:C.border, borderRadius:16, overflow:"hidden" }}>
          {[["🎯","Pick Your Role","Browse 8 IT roles — frontend to cloud security. Find the one that matches your target job."],["📖","Study Topic by Topic","Work through curated Q&A and coding challenges — from fundamentals to senior-level depth."],["✅","Crack the Interview","Walk in knowing exactly what to expect and the depth of answer that impresses at every level."]].map(([icon,title,desc],i)=>(
            <div key={i} style={{ background:C.surf, padding:"32px 26px", position:"relative", transition:"background 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surf2}
              onMouseLeave={e=>e.currentTarget.style.background=C.surf}>
              <div style={{ position:"absolute", top:14, right:20, fontFamily:"'Instrument Serif',serif", fontSize:"2.8rem", color:"rgba(255,255,255,0.03)", pointerEvents:"none", userSelect:"none" }}>0{i+1}</div>
              <div style={{ width:42,height:42,borderRadius:11,background:"rgba(110,107,255,0.08)",border:"1px solid rgba(110,107,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:14 }}>{icon}</div>
              <div style={{ fontSize:"0.95rem", fontWeight:700, marginBottom:7 }}>{title}</div>
              <p style={{ fontSize:"0.81rem", color:C.muted, lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 20px 60px", background:"linear-gradient(135deg,rgba(110,107,255,0.1) 0%,rgba(0,212,170,0.05) 50%,rgba(255,107,107,0.07) 100%)", border:`1px solid ${C.border}`, borderRadius:20, padding:"54px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(1.7rem,5vw,3.4rem)", lineHeight:1.05, letterSpacing:"-0.02em" }}>
          Ready to Forge Your<br/>
          <em style={{ fontStyle:"italic", background:`linear-gradient(135deg,${C.accent},${C.accent3})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Dream Offer?</em>
        </h2>
        <p style={{ fontSize:"0.93rem", color:C.muted, marginTop:12, maxWidth:440, marginLeft:"auto", marginRight:"auto", lineHeight:1.65 }}>
          Pick a role and start studying questions from real interviews — completely free.
        </p>
        <button onClick={scrollToRoles}
          style={{ marginTop:24, background:C.accent, color:"#fff", padding:"13px 36px", borderRadius:10, border:"none", fontSize:"0.93rem", fontWeight:700, transition:"all 0.2s" }}
          onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"#8886ff",transform:"translateY(-2px)"})}
          onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:C.accent,transform:"none"})}>
          Start Now →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"1.15rem", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,#6e6bff,#a78bff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontFamily:"'DM Mono',monospace",color:"#fff" }}>IF</div>
          InterviewForge
        </div>
        <div style={{ fontSize:"0.73rem", color:C.muted }}>© 2026 InterviewForge. Built for ambitious IT folks.</div>
        <div style={{ display:"flex", gap:18 }}>
          {["Privacy","Terms","Contact"].map(l=><a key={l} href="#" style={{ fontSize:"0.73rem", color:C.muted }}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────
function Navbar({ currentRole, onBack, onExplore }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  useEffect(()=>{
    const h = ()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  useEffect(()=>setMobOpen(false),[currentRole]);

  return (
    <>
      <nav className={`nav-bar${scrolled||currentRole?" nav-scrolled":""}`}>
        <div onClick={onBack} style={{ fontFamily:"'Instrument Serif',serif", fontSize:"1.32rem", display:"flex", alignItems:"center", gap:8, cursor:"pointer", color:C.text, userSelect:"none" }}>
          <div style={{ width:27,height:27,borderRadius:7,background:"linear-gradient(135deg,#6e6bff,#a78bff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.63rem",fontFamily:"'DM Mono',monospace",color:"#fff",flexShrink:0 }}>IF</div>
          <span style={{ display:"block" }}>InterviewForge</span>
        </div>

        {/* Desktop */}
        <div className="nav-desktop" style={{ display:"flex", alignItems:"center", gap:24 }}>
          <button onClick={currentRole?onBack:onExplore}
            style={{ background:"transparent", color:C.muted, border:"none", fontFamily:"'Syne',sans-serif", fontSize:"0.76rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>
            {currentRole?"← All Roles":"Roles"}
          </button>
          <button onClick={onExplore}
            style={{ background:C.accent, color:"#fff", border:"none", padding:"8px 17px", borderRadius:8, fontFamily:"'Syne',sans-serif", fontSize:"0.76rem", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", transition:"background 0.2s" }}
            onMouseEnter={e=>e.target.style.background="#8886ff"} onMouseLeave={e=>e.target.style.background=C.accent}>
            Explore →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="mob-hamburger" onClick={()=>setMobOpen(!mobOpen)}
          style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 11px", color:C.text, fontSize:"0.95rem" }}>
          {mobOpen?"✕":"☰"}
        </button>
      </nav>

      {/* Mobile full menu */}
      {mobOpen && (
        <div style={{ position:"fixed", inset:0, background:C.bg, zIndex:300, overflowY:"auto", padding:"70px 20px 30px" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <button onClick={()=>{onBack();setMobOpen(false);}} style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", color:C.text, fontSize:"0.88rem", fontWeight:700, textAlign:"left" }}>🏠 Home</button>
            <button onClick={()=>{onExplore();setMobOpen(false);}} style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", color:C.text, fontSize:"0.88rem", fontWeight:700, textAlign:"left" }}>📚 All Roles</button>
            <div style={{ height:1, background:C.border, margin:"4px 0" }}/>
            {ROLES.map(r=>(
              <button key={r.id} onClick={()=>{ document.dispatchEvent(new CustomEvent("selectRole",{detail:r.id})); setMobOpen(false); }}
                style={{ background:"transparent", border:"none", padding:"12px 14px", color:C.muted, fontFamily:"'Syne',sans-serif", fontSize:"0.84rem", fontWeight:600, textAlign:"left", display:"flex", alignItems:"center", gap:10, borderRadius:8, transition:"background 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.surf}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{r.icon}</span><span>{r.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);

  const selectRole = useCallback(id=>{
    const r = ROLES.find(x=>x.id===id);
    if(r) { setRole(r); window.scrollTo(0,0); }
  },[]);

  const goHome = useCallback(()=>{ setRole(null); window.scrollTo(0,0); },[]);

  const exploreRoles = useCallback(()=>{
    setRole(null);
    setTimeout(()=>{
      document.querySelector('[data-roles]')?.scrollIntoView({behavior:"smooth"});
    },80);
  },[]);

  useEffect(()=>{
    const h = e=>selectRole(e.detail);
    document.addEventListener("selectRole",h);
    return ()=>document.removeEventListener("selectRole",h);
  },[selectRole]);

  return (
    <>
      <style>{G}</style>
      <Navbar currentRole={role} onBack={goHome} onExplore={exploreRoles}/>
      {role
        ? <RolePage key={role.id} role={role} onBack={goHome}/>
        : <HomePage onSelectRole={selectRole}/>
      }
    </>
  );
}