import { create } from 'zustand';

function generateCandidateItemsets(frequentItemsets, k) {
  const candidates = [];
  for (let i = 0; i < frequentItemsets.length; i++) {
    for (let j = i + 1; j < frequentItemsets.length; j++) {
      const itemset1 = frequentItemsets[i];
      const itemset2 = frequentItemsets[j];
      const candidate = itemset1.concat(itemset2[j]);

      // Check if all subsets of size k-1 are frequent
      let isSubsetFrequent = true;
      for (let subsetSize = 1; subsetSize < k; subsetSize++) {
        const subset = candidate.slice(0, subsetSize);
        if (!frequentItemsets.some((itemset) => itemset.every((item) => subset.includes(item)))) {
          isSubsetFrequent = false;
          break;
        }
      }

      if (isSubsetFrequent && !candidates.some((c) => c.every((item) => candidate.includes(item)))) {
        candidates.push(candidate);
      }
    }
  }
  return candidates;
}

function countSupport(transactions, itemset) {
  let count = 0;
  for (const transaction of transactions) {
    if (transaction.every((item) => itemset.includes(item))) {
      count++;
    }
  }
  return count;
}

function combineFrequentItemsets(frequentItemsets, minSupport) {
  const newCandidates = [];
  // Iterate through all pairs of frequent itemsets
  for (let i = 0; i < frequentItemsets.length; i++) {
    for (let j = i + 1; j < frequentItemsets.length; j++) {
      const itemset1 = frequentItemsets[i];
      const itemset2 = frequentItemsets[j];

      // Check if they share all items except the last one
      if (itemset1.slice(0, itemset1.length - 1).every((item) => itemset2.includes(item))) {
        const combined = [...itemset1, itemset2[itemset2.length - 1]];
        // Filter out duplicates within the combined set
        if (!newCandidates.some((c) => c.every((item) => combined.includes(item)))) {
          newCandidates.push(combined);
        }
      }
    }
  }

  // Filter candidates based on minimum support using countSupport
  const filteredCandidates = [];
  for (const candidate of newCandidates) {
    const supportCount = countSupport(transactions, candidate);
    if (supportCount >= minSupport) {
      filteredCandidates.push(candidate);
    }
  }

  return filteredCandidates;
}

function aprioriAlgorithm(transactions, minSupport) {
  // Initialize frequent itemsets of size 1
  const frequentItemsets = [];
  const itemCounts = {};
  for (const transaction of transactions) {
    for (const item of transaction) {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    }
  }

  // No need for parseInt here, keep items as they are
  for (const item in itemCounts) {
    if (itemCounts[item] >= minSupport) {
      frequentItemsets.push([item]);
    }
  }

  // Iterate through itemset sizes (k)
  let k = 2;
  let candidateItemsets = generateCandidateItemsets(frequentItemsets, k);
  while (candidateItemsets.length > 0) {
    const frequentItemsetsThisPass = [];
    for (const candidate of candidateItemsets) {
      const supportCount = countSupport(transactions, candidate);
      if (supportCount >= minSupport) {
        frequentItemsetsThisPass.push(candidate);
      }
    }
    frequentItemsets.push(...frequentItemsetsThisPass);

    // Combine frequent itemsets for next iteration
    candidateItemsets = combineFrequentItemsets(frequentItemsetsThisPass, minSupport);
    k++;
  }

  return frequentItemsets;
}

export const useApriori = create((set) => ({
  frequentItemsets: [],
  setFrequentItemsets: (itemsets) => set({ frequentItemsets: itemsets }),
  apriori: (transactions, minSupport) => {
    const frequentItemsets = aprioriAlgorithm(transactions, minSupport);
    set({ frequentItemsets });
  },
}));