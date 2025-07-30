function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createBars(arr) {
  const container = document.getElementById("visualizer");
  container.innerHTML = "";
  arr.forEach(num => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.textContent = num;
    container.appendChild(bar);
  });
}

async function highlight(index, found = false) {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(bar => bar.classList.remove("active", "found"));
  if (bars[index]) {
    bars[index].classList.add(found ? "found" : "active");
    await sleep(500);
  }
}

async function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    await highlight(i);
    if (arr[i] == target) {
      await highlight(i, true);
      return i;
    }
  }
  return -1;
}

async function binarySearch(arr, target) {
  let sorted = [...arr].sort((a, b) => a - b);
  createBars(sorted);
  let left = 0, right = sorted.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    await highlight(mid);
    if (sorted[mid] == target) {
      await highlight(mid, true);
      return mid;
    }
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

async function jumpSearch(arr, target) {
  let sorted = [...arr].sort((a, b) => a - b);
  createBars(sorted);
  let n = sorted.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (sorted[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  for (let i = prev; i < Math.min(step, n); i++) {
    await highlight(i);
    if (sorted[i] == target) {
      await highlight(i, true);
      return i;
    }
  }
  return -1;
}

async function interpolationSearch(arr, target) {
  let sorted = [...arr].sort((a, b) => a - b);
  createBars(sorted);
  let low = 0, high = sorted.length - 1;
  while (low <= high && target >= sorted[low] && target <= sorted[high]) {
    if (low === high) {
      if (sorted[low] == target) {
        await highlight(low, true);
        return low;
      }
      return -1;
    }
    let pos = low + Math.floor(((target - sorted[low]) * (high - low)) / (sorted[high] - sorted[low]));
    await highlight(pos);
    if (sorted[pos] == target) {
      await highlight(pos, true);
      return pos;
    }
    if (sorted[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}

async function exponentialSearch(arr, target) {
  let sorted = [...arr].sort((a, b) => a - b);
  createBars(sorted);
  let n = sorted.length;
  if (sorted[0] == target) {
    await highlight(0, true);
    return 0;
  }
  let i = 1;
  while (i < n && sorted[i] <= target) {
    await highlight(i);
    i *= 2;
  }
  let left = Math.floor(i / 2), right = Math.min(i, n - 1);
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    await highlight(mid);
    if (sorted[mid] == target) {
      await highlight(mid, true);
      return mid;
    }
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

async function startSearch() {
  const input = document.getElementById("arrayInput").value.split(",").map(Number);
  const target = Number(document.getElementById("targetInput").value);
  const algo = document.getElementById("algorithm").value;
  createBars(input);

  let index = -1;
  switch (algo) {
    case "linear": index = await linearSearch(input, target); break;
    case "binary": index = await binarySearch(input, target); break;
    case "jump": index = await jumpSearch(input, target); break;
    case "interpolation": index = await interpolationSearch(input, target); break;
    case "exponential": index = await exponentialSearch(input, target); break;
  }

  document.getElementById("result").textContent = index !== -1 ?
    `✅ Target found at index ${index}` :
    `❌ Target not found`;
}
