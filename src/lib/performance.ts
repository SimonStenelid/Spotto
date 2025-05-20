type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  label: 'web-vital' | 'custom';
  startTime?: number;
  valueText?: string;
};

// Non-blocking performance monitoring
const queue: WebVitalMetric[] = [];
const processQueue = debounce(() => {
  if (queue.length === 0) return;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance metrics:', queue);
  }
  
  // Send metrics in batch
  if (navigator.sendBeacon) {
    const data = new Blob([JSON.stringify(queue)], { type: 'application/json' });
    navigator.sendBeacon('/api/metrics', data);
  }
  
  queue.length = 0;
}, 1000);

export function reportWebVitals(metric: WebVitalMetric) {
  queue.push(metric);
  processQueue();
}

export function measurePerformance(name: string, fn: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    reportWebVitals({
      id: crypto.randomUUID(),
      name,
      value: end - start,
      label: 'custom',
      startTime: start,
    });
  } else {
    fn();
  }
}

// Utility function for debouncing
function debounce(fn: Function, ms: number) {
  let timer: NodeJS.Timeout;
  return function(this: unknown, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Monitor memory usage in development
if (process.env.NODE_ENV === 'development' && (performance as any).memory) {
  setInterval(() => {
    reportWebVitals({
      id: crypto.randomUUID(),
      name: 'memory-usage',
      value: (performance as any).memory.usedJSHeapSize,
      label: 'custom',
    });
  }, 10000);
}

// Monitor long tasks
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      reportWebVitals({
        id: crypto.randomUUID(),
        name: 'long-task',
        value: entry.duration,
        label: 'custom',
        startTime: entry.startTime,
      });
    });
  });
  observer.observe({ entryTypes: ['longtask'] });
} 