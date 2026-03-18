export interface StateSpaceDefinition {
  id: string;
  name: string;
  formula: string;
  description: string;
  example: string;
  growthClass: 'Polynomial' | 'Exponential' | 'Factorial' | 'Super-Exponential' | 'Double-Exponential' | 'Triple-Exponential';
  category: 'Combinatorics' | 'Graph Theory' | 'AI Search Problems' | 'Constraint Satisfaction' | 'Machine Learning Spaces' | 'Mathematical Structures';
  detailedExplanation: string;
  calculateLog10: (n: number) => number;
}

export const MathUtils = {
  log10Factorial: (n: number): number => {
    if (n <= 0) return 0;
    if (n < 100) {
      let res = 0;
      for (let i = 2; i <= n; i++) res += Math.log10(i);
      return res;
    }
    return (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n)) / Math.log(10);
  },

  log10Combination: (n: number, k: number): number => {
    if (k < 0 || k > n) return -Infinity;
    if (k === 0 || k === n) return 0;
    if (k > n / 2) k = n - k;
    return MathUtils.log10Factorial(n) - MathUtils.log10Factorial(k) - MathUtils.log10Factorial(n - k);
  },

  formatResult: (log10Value: number): string => {
    if (log10Value === -Infinity) return "0";
    if (isNaN(log10Value)) return "Undefined";
    if (log10Value < 0) return Math.pow(10, log10Value).toPrecision(4);
    if (log10Value < 15) {
      const val = Math.pow(10, log10Value);
      if (val < 1e6) return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return val.toExponential(4).replace('e+', ' × 10^');
    }
    if (log10Value < 1e15) {
      const exponent = Math.floor(log10Value);
      const mantissa = Math.pow(10, log10Value - exponent);
      return `${mantissa.toFixed(4)} × 10^${exponent}`;
    }
    return `10^(10^${Math.log10(log10Value).toFixed(4)})`;
  }
};

export const stateSpaces: StateSpaceDefinition[] = [
  // 1-10: Basic Combinatorics
  { 
    id: 'f1', name: 'Permutations', formula: 'n!', description: 'Ways to arrange n distinct objects.', 
    example: 'n=5, 5! = 120', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Every position can be filled by a remaining unused element. For n elements, there are n choices for the first, n-1 for the second, and so on.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f2', name: 'Power Set', formula: '2^n', description: 'Total subsets of n elements.', 
    example: 'n=3, 2^3 = 8', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Each element in a set of size n can either be included or excluded from a subset, leading to 2 choices per element.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f3', name: 'Central Combinations', formula: 'C(n, n/2)', description: 'Middle row of Pascal\'s triangle.', 
    example: 'n=4, C(4,2) = 6', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'The number of ways to choose exactly half of the elements from a set of size n.',
    calculateLog10: (n) => MathUtils.log10Combination(n, Math.floor(n/2)) 
  },
  { 
    id: 'f4', name: 'Derangements', formula: '!n', description: 'Permutations with no fixed points.', 
    example: 'n=3, !3 = 2', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'A permutation where no element is in its original position. Asymptotically n!/e.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) - Math.log10(Math.E) 
  },
  { 
    id: 'f5', name: 'Catalan Numbers', formula: 'C(2n, n)/(n+1)', description: 'Binary trees, polygon triangulations.', 
    example: 'n=3, C_3 = 5', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Appears in many counting problems involving recursive structures like balanced parentheses or binary trees.',
    calculateLog10: (n) => MathUtils.log10Combination(2*n, n) - Math.log10(n+1) 
  },
  { 
    id: 'f6', name: 'Bell Numbers', formula: 'B_n', description: 'Set partitions of n elements.', 
    example: 'n=3, B_3 = 5', growthClass: 'Super-Exponential', category: 'Combinatorics',
    detailedExplanation: 'The number of ways to partition a set of n elements into non-empty, disjoint subsets.',
    calculateLog10: (n) => n === 0 ? 0 : (n * Math.log(n) - n * Math.log(Math.log(n+1.1))) / Math.log(10) 
  },
  { 
    id: 'f7', name: 'Integer Partitions', formula: 'p(n)', description: 'Ways to sum to n.', 
    example: 'n=4, p(4) = 5', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'The number of ways to write n as a sum of positive integers where order does not matter.',
    calculateLog10: (n) => n === 0 ? 0 : (Math.PI * Math.sqrt(2*n/3) - Math.log(4*n*Math.sqrt(3))) / Math.log(10) 
  },
  { 
    id: 'f8', name: 'Circular Permutations', formula: '(n-1)!', description: 'Arrangements in a circle.', 
    example: 'n=4, (4-1)! = 6', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Arrangements where rotations are considered identical. One element is fixed to break symmetry.',
    calculateLog10: (n) => n <= 1 ? 0 : MathUtils.log10Factorial(n-1) 
  },
  { 
    id: 'f9', name: 'Double Factorial', formula: 'n!!', description: 'Product of every other integer.', 
    example: 'n=5, 5!! = 15', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'The product of all integers from n down to 1 that have the same parity as n.',
    calculateLog10: (n) => 0.5 * (MathUtils.log10Factorial(n) + Math.log10(2) * (n/2)) 
  },
  { 
    id: 'f10', name: 'Compositions', formula: '2^(n-1)', description: 'Ordered integer partitions.', 
    example: 'n=3, 2^2 = 4', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Ways to write n as a sum of positive integers where the order of summands matters.',
    calculateLog10: (n) => (n-1) * Math.log10(2) 
  },

  // 11-20: Graph Theory
  { 
    id: 'f11', name: 'Labeled Trees', formula: 'n^(n-2)', description: 'Cayley\'s formula for spanning trees.', 
    example: 'n=3, 3^1 = 3', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'The number of distinct trees that can be formed using n labeled vertices.',
    calculateLog10: (n) => n <= 2 ? 0 : (n-2) * Math.log10(n) 
  },
  { 
    id: 'f12', name: 'Undirected Graphs', formula: '2^(n(n-1)/2)', description: 'Total labeled undirected graphs.', 
    example: 'n=3, 2^3 = 8', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'Every pair of vertices may or may not have an edge. There are n(n-1)/2 possible edges.',
    calculateLog10: (n) => (n*(n-1)/2) * Math.log10(2) 
  },
  { 
    id: 'f13', name: 'Directed Graphs', formula: '2^(n(n-1))', description: 'Total labeled directed graphs.', 
    example: 'n=2, 2^2 = 4', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'Each ordered pair (u,v) can either have a directed edge or not.',
    calculateLog10: (n) => (n*(n-1)) * Math.log10(2) 
  },
  { 
    id: 'f14', name: 'Adjacency Matrices', formula: '2^(n^2)', description: 'Binary n×n matrices.', 
    example: 'n=2, 2^4 = 16', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'The number of n×n matrices with entries in {0, 1}. Corresponds to directed graphs with self-loops.',
    calculateLog10: (n) => (n*n) * Math.log10(2) 
  },
  { 
    id: 'f15', name: 'Self-Complementary Graphs', formula: '2^(n(n-2)/8)', description: 'Graphs isomorphic to their complement.', 
    example: 'n=4, 2^1 = 2', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'Graphs that are isomorphic to the graph formed by their non-edges.',
    calculateLog10: (n) => (n*(n-2)/8) * Math.log10(2) 
  },
  { 
    id: 'f16', name: 'Bipartite Graphs', formula: '2^(n^2/4)', description: 'Approximate labeled bipartite graphs.', 
    example: 'n=4, 2^4 = 16', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'Graphs whose vertices can be divided into two independent sets.',
    calculateLog10: (n) => (n*n/4) * Math.log10(2) 
  },
  { 
    id: 'f17', name: 'Hamiltonian Cycles', formula: '(n-1)!/2', description: 'Cycles visiting every vertex once.', 
    example: 'n=4, 3!/2 = 3', growthClass: 'Factorial', category: 'Graph Theory',
    detailedExplanation: 'Distinct cycles in a complete graph that visit every vertex exactly once.',
    calculateLog10: (n) => n <= 2 ? -Infinity : MathUtils.log10Factorial(n-1) - Math.log10(2) 
  },
  { 
    id: 'f18', name: 'Perfect Matchings', formula: '(2n-1)!!', description: 'Pairings in a complete graph K_2n.', 
    example: 'n=2, 3!! = 3', growthClass: 'Factorial', category: 'Graph Theory',
    detailedExplanation: 'Ways to partition 2n vertices into n disjoint edges.',
    calculateLog10: (n) => MathUtils.log10Factorial(2*n) - (n*Math.log10(2) + MathUtils.log10Factorial(n)) 
  },
  { 
    id: 'f19', name: 'Rooted Labeled Trees', formula: 'n^(n-1)', description: 'Trees with a designated root.', 
    example: 'n=3, 3^2 = 9', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'Labeled trees where one vertex is chosen as the root.',
    calculateLog10: (n) => (n-1) * Math.log10(n) 
  },
  { 
    id: 'f20', name: 'Labeled Forests', formula: '(n+1)^(n-1)', description: 'Collections of labeled trees.', 
    example: 'n=2, 3^1 = 3', growthClass: 'Super-Exponential', category: 'Graph Theory',
    detailedExplanation: 'A graph where every connected component is a tree.',
    calculateLog10: (n) => (n-1) * Math.log10(n+1) 
  },

  // 21-30: AI Search Problems
  { 
    id: 'f21', name: 'Boolean Functions', formula: '2^(2^n)', description: 'Truth tables for n variables.', 
    example: 'n=2, 2^4 = 16', growthClass: 'Double-Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The number of distinct ways to assign output values to all 2^n input combinations.',
    calculateLog10: (n) => Math.pow(2, n) * Math.log10(2) 
  },
  { 
    id: 'f22', name: 'CSP State Space', formula: 'd^n', description: 'Assignments for n variables, domain d=3.', 
    example: 'n=5, 3^5 = 243', growthClass: 'Exponential', category: 'Constraint Satisfaction',
    detailedExplanation: 'Total possible assignments in a Constraint Satisfaction Problem with n variables and domain size d.',
    calculateLog10: (n) => n * Math.log10(3) 
  },
  { 
    id: 'f23', name: 'Minimax Nodes', formula: 'b^d', description: 'Search tree nodes, b=10, d=n.', 
    example: 'n=3, 10^3 = 1000', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Total nodes in a search tree with constant branching factor b and depth d.',
    calculateLog10: (n) => n 
  },
  { 
    id: 'f24', name: 'Alpha-Beta Nodes', formula: 'b^(d/2)', description: 'Optimal alpha-beta pruning, b=10.', 
    example: 'n=4, 10^2 = 100', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The number of nodes visited by alpha-beta pruning in the best-case scenario.',
    calculateLog10: (n) => n/2 
  },
  { 
    id: 'f25', name: 'RL Policy Space', formula: 'a^s', description: 'Policies for s=n states, a=2 actions.', 
    example: 'n=10, 2^10 = 1024', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The number of possible deterministic policies in a Reinforcement Learning environment.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f26', name: 'Hypothesis Space', formula: '2^(2^n)', description: 'Functions for n binary features.', 
    example: 'n=2, 2^4 = 16', growthClass: 'Double-Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The total number of possible binary classification functions over n binary features.',
    calculateLog10: (n) => Math.pow(2, n) * Math.log10(2) 
  },
  { 
    id: 'f27', name: 'Decision Stumps', formula: '2n', description: 'Single-feature decision trees.', 
    example: 'n=10, 20', growthClass: 'Polynomial', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of possible decision stumps (trees of depth 1) for n binary features.',
    calculateLog10: (n) => Math.log10(2*n) 
  },
  { 
    id: 'f28', name: 'Edit Distance Space', formula: '3^n', description: 'Edit sequences of length n.', 
    example: 'n=5, 3^5 = 243', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Possible sequences of insertions, deletions, and substitutions of length n.',
    calculateLog10: (n) => n * Math.log10(3) 
  },
  { 
    id: 'f29', name: 'Version Space', formula: '2^n', description: 'Subsets of n hypotheses.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The set of all hypotheses consistent with the observed training data.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f30', name: 'Grid World States', formula: 'n^2', description: 'States in an n×n grid.', 
    example: 'n=10, 100', growthClass: 'Polynomial', category: 'AI Search Problems',
    detailedExplanation: 'The number of possible locations for an agent in a simple 2D grid environment.',
    calculateLog10: (n) => 2 * Math.log10(n) 
  },

  // 31-40: Machine Learning
  { 
    id: 'f31', name: 'Discrete Weights', formula: 'k^w', description: 'n binary weights in a network.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'Search space for neural network weights when restricted to binary values.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f32', name: 'Feature Subsets', formula: '2^n', description: 'Possible feature selections.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of ways to choose a subset of features for a model.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f33', name: 'Layer Orderings', formula: 'n!', description: 'Ways to order n layers.', 
    example: 'n=5, 120', growthClass: 'Factorial', category: 'Machine Learning Spaces',
    detailedExplanation: 'Permutations of n distinct layers in a sequential neural network.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f34', name: 'K-Means Partitions', formula: 'k^n', description: 'Assigning n points to k=2 clusters.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'Total possible assignments of n data points to k clusters.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f35', name: 'Neural Topologies', formula: 'n^(n-2)', description: 'Possible connections in n neurons.', 
    example: 'n=3, 3', growthClass: 'Super-Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of labeled trees representing potential sparse connection architectures.',
    calculateLog10: (n) => n <= 2 ? 0 : (n-2) * Math.log10(n) 
  },
  { 
    id: 'f36', name: 'Hyperparameter Grid', formula: 's^n', description: 'n parameters with s=5 steps.', 
    example: 'n=3, 125', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'Total combinations in a grid search for n hyperparameters with s discrete values each.',
    calculateLog10: (n) => n * Math.log10(5) 
  },
  { 
    id: 'f37', name: 'Ensemble Subsets', formula: '2^n', description: 'Subsets of n models.', 
    example: 'n=5, 32', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of possible sub-ensembles that can be formed from n base models.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f38', name: 'Data Permutations', formula: 'n!', description: 'Shuffling n data points.', 
    example: 'n=10, 3.6M', growthClass: 'Factorial', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of ways to order n training examples in a dataset.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f39', name: 'Binary Classifications', formula: '2^n', description: 'Labelings for n instances.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'The number of ways to assign binary labels to n distinct data points.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f40', name: 'Multi-class Labels', formula: 'k^n', description: 'n instances, k=10 classes.', 
    example: 'n=5, 10^5', growthClass: 'Exponential', category: 'Machine Learning Spaces',
    detailedExplanation: 'Total possible labelings for n instances with k available classes.',
    calculateLog10: (n) => n 
  },

  // 41-50: Combinatorial Objects
  { 
    id: 'f41', name: 'Involutions', formula: 'I_n', description: 'Permutations that are self-inverse.', 
    example: 'n=3, 4', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Permutations where every cycle has length 1 or 2.',
    calculateLog10: (n) => (0.5 * n * (Math.log(n) - 1) + Math.sqrt(n)) / Math.log(10) 
  },
  { 
    id: 'f42', name: 'Motzkin Numbers', formula: 'M_n', description: 'Non-intersecting chords.', 
    example: 'n=4, 9', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Ways to draw non-intersecting chords between n points on a circle.',
    calculateLog10: (n) => n * Math.log10(3) - 1.5 * Math.log10(n+1) 
  },
  { 
    id: 'f43', name: 'Schröder Numbers', formula: 'S_n', description: 'Lattice paths with diagonals.', 
    example: 'n=3, 22', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Paths from (0,0) to (n,n) using steps (1,0), (0,1), and (1,1) that do not go above y=x.',
    calculateLog10: (n) => n * Math.log10(3 + 2*Math.sqrt(2)) 
  },
  { 
    id: 'f44', name: 'Delannoy Numbers', formula: 'D(n,n)', description: 'Grid paths with diagonals.', 
    example: 'n=3, 63', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'The number of paths from (0,0) to (n,n) using steps (1,0), (0,1), and (1,1).',
    calculateLog10: (n) => n * Math.log10(3 + 2*Math.sqrt(2)) - 0.5 * Math.log10(n+1) 
  },
  { 
    id: 'f45', name: 'Euler Zigzag Numbers', formula: 'E_n', description: 'Alternating permutations.', 
    example: 'n=4, 5', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Permutations where elements increase and decrease alternately.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) + (n+1) * Math.log10(2/Math.PI) 
  },
  { 
    id: 'f46', name: 'Fubini Numbers', formula: 'F_n', description: 'Ordered set partitions.', 
    example: 'n=3, 13', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Number of ways to rank n elements where ties are allowed.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) - (n+1) * Math.log10(Math.log(2)) 
  },
  { 
    id: 'f47', name: 'Naranyana Numbers', formula: 'N(n, n/2)', description: 'Dyck paths with k peaks.', 
    example: 'n=4, 6', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Refinement of Catalan numbers based on the number of peaks in the path.',
    calculateLog10: (n) => MathUtils.log10Combination(n, Math.floor(n/2)) * 2 - Math.log10(n+1) 
  },
  { 
    id: 'f48', name: 'Stirling 2nd S(n, 2)', formula: '2^(n-1)-1', description: 'Partitions into 2 subsets.', 
    example: 'n=4, 7', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Ways to partition a set of n elements into exactly 2 non-empty subsets.',
    calculateLog10: (n) => (n-1) * Math.log10(2) 
  },
  { 
    id: 'f49', name: 'Stirling 1st s(n, 2)', formula: '(n-1)! H_{n-1}', description: 'Permutations with 2 cycles.', 
    example: 'n=3, 3', growthClass: 'Factorial', category: 'Combinatorics',
    detailedExplanation: 'Number of permutations of n elements that decompose into exactly 2 disjoint cycles.',
    calculateLog10: (n) => MathUtils.log10Factorial(n-1) + Math.log10(Math.log(n+1)) 
  },
  { 
    id: 'f50', name: 'Eulerian Numbers', formula: 'A(n, 1)', description: 'Permutations with 1 ascent.', 
    example: 'n=3, 4', growthClass: 'Exponential', category: 'Combinatorics',
    detailedExplanation: 'Number of permutations of {1...n} with exactly one index i such that a_i < a_{i+1}.',
    calculateLog10: (n) => Math.log10(Math.pow(2, n) - (n+1)) 
  },

  // 51-60: Robotics & Planning
  { 
    id: 'f51', name: 'Joint Configurations', formula: 'k^n', description: 'n joints, k=10 discrete angles.', 
    example: 'n=6, 10^6', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Configuration space for a robotic arm with n joints and k discrete positions per joint.',
    calculateLog10: (n) => n 
  },
  { 
    id: 'f52', name: 'Path Planning Nodes', formula: 'v^n', description: 'n steps, v=4 directions.', 
    example: 'n=10, 4^10', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Search space for a path of length n in a 4-connected grid.',
    calculateLog10: (n) => n * Math.log10(4) 
  },
  { 
    id: 'f53', name: 'Obstacle Subsets', formula: '2^n', description: 'Subsets of n obstacles.', 
    example: 'n=5, 32', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The number of possible configurations of active obstacles in a dynamic environment.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f54', name: 'Robot Swarm States', formula: 's^n', description: 'n robots, s=100 locations.', 
    example: 'n=3, 10^6', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Joint state space for n independent robots moving in a discrete environment with s locations.',
    calculateLog10: (n) => 2 * n 
  },
  { 
    id: 'f55', name: 'Task Sequences', formula: 'n!', description: 'Ordering n robotic tasks.', 
    example: 'n=5, 120', growthClass: 'Factorial', category: 'AI Search Problems',
    detailedExplanation: 'The number of possible execution orders for a set of n independent tasks.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f56', name: 'Grasp Configurations', formula: 'k^n', description: 'n fingers, k=5 positions.', 
    example: 'n=3, 125', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Discrete state space for a robotic hand with n fingers and k possible states per finger.',
    calculateLog10: (n) => n * Math.log10(5) 
  },
  { 
    id: 'f57', name: 'Sensor Fusion States', formula: '2^n', description: 'n binary sensor inputs.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The total number of possible combined readings from n binary sensors.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f58', name: 'Trajectory Samples', formula: 'k^n', description: 'n time steps, k=3 velocities.', 
    example: 'n=10, 3^10', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Search space for a discretized trajectory of length n with k possible control inputs at each step.',
    calculateLog10: (n) => n * Math.log10(3) 
  },
  { 
    id: 'f59', name: 'Map Occupancy', formula: '2^(n^2)', description: 'n×n grid occupancy map.', 
    example: 'n=10, 2^100', growthClass: 'Super-Exponential', category: 'AI Search Problems',
    detailedExplanation: 'The number of possible binary occupancy maps for an n×n grid.',
    calculateLog10: (n) => n * n * Math.log10(2) 
  },
  { 
    id: 'f60', name: 'Action Sequences', formula: 'a^n', description: 'n steps, a=10 actions.', 
    example: 'n=5, 10^5', growthClass: 'Exponential', category: 'AI Search Problems',
    detailedExplanation: 'Total possible sequences of n actions from a set of a available actions.',
    calculateLog10: (n) => n 
  },

  // 61-70: Advanced Math
  { 
    id: 'f61', name: 'Latin Squares', formula: 'L_n', description: 'n×n grid arrangements.', 
    example: 'n=3, 12', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'An n×n grid filled with n symbols such that each symbol appears exactly once in each row and column.',
    calculateLog10: (n) => 2 * n * MathUtils.log10Factorial(n) - n * n * Math.log10(n) 
  },
  { 
    id: 'f62', name: 'Magic Squares (3x3)', formula: 'n^2', description: 'Magic squares with sum n.', 
    example: 'n=15, 1', growthClass: 'Polynomial', category: 'Mathematical Structures',
    detailedExplanation: 'The number of 3x3 magic squares where rows, columns, and diagonals sum to n.',
    calculateLog10: (n) => 2 * Math.log10(n+1) 
  },
  { 
    id: 'f63', name: 'Meanders', formula: '12.26^n', description: 'Curves crossing a line.', 
    example: 'n=3, 12.26^3', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Non-self-intersecting closed curves that cross a line at 2n points.',
    calculateLog10: (n) => n * Math.log10(12.26) 
  },
  { 
    id: 'f64', name: 'Self-Avoiding Walks', formula: '2.63^n', description: 'Paths not crossing themselves.', 
    example: 'n=10, 2.63^10', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Paths on a lattice that do not visit the same vertex more than once.',
    calculateLog10: (n) => n * Math.log10(2.63) 
  },
  { 
    id: 'f65', name: 'Polyominoes', formula: '4.06^n', description: 'Shapes from n squares.', 
    example: 'n=5, 12', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Plane geometric figures formed by joining n equal squares edge to edge.',
    calculateLog10: (n) => n * Math.log10(4.06) 
  },
  { 
    id: 'f66', name: 'Planar Maps', formula: '9.48^n', description: 'Rooted planar maps.', 
    example: 'n=5, 9.48^5', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Embedding of a connected graph into a sphere, with one edge designated as the root.',
    calculateLog10: (n) => n * Math.log10(9.48) 
  },
  { 
    id: 'f67', name: 'Triangulations', formula: 'C(n-2)', description: 'Polygon divisions.', 
    example: 'n=5, C_3 = 5', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Ways to divide a convex n-gon into triangles using non-intersecting diagonals.',
    calculateLog10: (n) => n <= 2 ? 0 : MathUtils.log10Combination(2*n-4, n-2) - Math.log10(n-1) 
  },
  { 
    id: 'f68', name: 'Dedekind Numbers', formula: '2^(C(n, n/2))', description: 'Monotone boolean functions.', 
    example: 'n=4, 2^6 = 64', growthClass: 'Double-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The number of monotone boolean functions of n variables.',
    calculateLog10: (n) => Math.pow(10, MathUtils.log10Combination(n, Math.floor(n/2))) * Math.log10(2) 
  },
  { 
    id: 'f69', name: 'Parking Functions', formula: '(n+1)^(n-1)', description: 'Valid parking sequences.', 
    example: 'n=3, 16', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Sequences of parking preferences that allow all n cars to park in n spots.',
    calculateLog10: (n) => (n-1) * Math.log10(n+1) 
  },
  { 
    id: 'f70', name: 'Young Tableaux', formula: '√n!', description: 'Standard Young Tableaux size.', 
    example: 'n=5, ~11', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'Combinatorial objects related to representations of the symmetric group.',
    calculateLog10: (n) => 0.5 * MathUtils.log10Factorial(n) 
  },

  // 71-80: Game Theory
  { 
    id: 'f71', name: 'Pure Strategies', formula: 's^p', description: 'p=n players, s=2 strategies.', 
    example: 'n=5, 32', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible combinations of pure strategies in an n-player game with 2 choices each.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f72', name: 'Game Outcomes', formula: 'o^n', description: 'n rounds, o=3 outcomes.', 
    example: 'n=10, 3^10', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible sequences of outcomes in a game played for n rounds.',
    calculateLog10: (n) => n * Math.log10(3) 
  },
  { 
    id: 'f73', name: 'Coalition Subsets', formula: '2^n', description: 'Subsets of n players.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible coalitions that can be formed by n players.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f74', name: 'Payoff Matrices', formula: 'k^(n^2)', description: 'n×n matrix, k=10 values.', 
    example: 'n=2, 10^4', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible payoff matrices for a 2-player game with n strategies each.',
    calculateLog10: (n) => n * n 
  },
  { 
    id: 'f75', name: 'Extensive Game Nodes', formula: 'b^n', description: 'n depth, b=5 branches.', 
    example: 'n=5, 5^5', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total nodes in a game tree of depth n with branching factor b.',
    calculateLog10: (n) => n * Math.log10(5) 
  },
  { 
    id: 'f76', name: 'Strategy Profiles', formula: 's^n', description: 'n players, s=10 strategies.', 
    example: 'n=3, 1000', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The joint strategy space for n players with s available strategies each.',
    calculateLog10: (n) => n 
  },
  { 
    id: 'f77', name: 'Bidding Sequences', formula: 'n!', description: 'Orderings of n bids.', 
    example: 'n=5, 120', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'Possible sequences in which n distinct bids can be placed in an auction.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f78', name: 'Auction Subsets', formula: '2^n', description: 'Subsets of n items.', 
    example: 'n=10, 1024', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible bundles of items that can be bid on in a combinatorial auction.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f79', name: 'Equilibrium States', formula: 'n^k', description: 'n states, k=3 parameters.', 
    example: 'n=10, 1000', growthClass: 'Polynomial', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible equilibrium configurations in a system with n states and k parameters.',
    calculateLog10: (n) => 3 * Math.log10(n+1) 
  },
  { 
    id: 'f80', name: 'Turn Sequences', formula: 'n!', description: 'n players taking turns.', 
    example: 'n=4, 24', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible turn orders for n players in a round-robin game.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },

  // 81-90: Computer Science
  { 
    id: 'f81', name: 'Binary Strings', formula: '2^n', description: 'Strings of length n.', 
    example: 'n=8, 256', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible bitstrings of length n.',
    calculateLog10: (n) => n * Math.log10(2) 
  },
  { 
    id: 'f82', name: 'Ternary Strings', formula: '3^n', description: 'Strings of length n.', 
    example: 'n=5, 243', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible strings of length n using a 3-character alphabet.',
    calculateLog10: (n) => n * Math.log10(3) 
  },
  { 
    id: 'f83', name: 'Quaternary Strings', formula: '4^n', description: 'Strings of length n.', 
    example: 'n=5, 1024', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible strings of length n using a 4-character alphabet (e.g., DNA).',
    calculateLog10: (n) => n * Math.log10(4) 
  },
  { 
    id: 'f84', name: 'Hexadecimal Strings', formula: '16^n', description: 'Strings of length n.', 
    example: 'n=2, 256', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible strings of length n using a 16-character alphabet.',
    calculateLog10: (n) => n * Math.log10(16) 
  },
  { 
    id: 'f85', name: 'Memory States', formula: '2^(8n)', description: 'n bytes of memory.', 
    example: 'n=1, 256', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The total number of possible states for n bytes of computer memory.',
    calculateLog10: (n) => 8 * n * Math.log10(2) 
  },
  { 
    id: 'f86', name: 'Pointer Space', formula: '(2^64)^n', description: 'n 64-bit pointers.', 
    example: 'n=1, 1.8e19', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The total addressable space for n 64-bit memory pointers.',
    calculateLog10: (n) => 64 * n * Math.log10(2) 
  },
  { 
    id: 'f87', name: 'Instruction Sequences', formula: 'k^n', description: 'n instructions, k=256 types.', 
    example: 'n=3, 1.6e7', growthClass: 'Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'Total possible sequences of n machine instructions from a set of k opcodes.',
    calculateLog10: (n) => n * Math.log10(256) 
  },
  { 
    id: 'f88', name: 'File Permutations', formula: 'n!', description: 'Ordering n files.', 
    example: 'n=5, 120', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'The number of ways to arrange n distinct files in a directory.',
    calculateLog10: (n) => MathUtils.log10Factorial(n) 
  },
  { 
    id: 'f89', name: 'Network Topologies', formula: '2^(n(n-1)/2)', description: 'Connections between n nodes.', 
    example: 'n=3, 8', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The number of possible connection patterns in a network of n labeled nodes.',
    calculateLog10: (n) => (n*(n-1)/2) * Math.log10(2) 
  },
  { 
    id: 'f90', name: 'Process Interleavings', formula: '(nk)! / (k!)^n', description: 'n processes, k=2 steps each.', 
    example: 'n=2, 6', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'The number of ways to interleave the steps of n concurrent processes.',
    calculateLog10: (n) => MathUtils.log10Factorial(2*n) - n * MathUtils.log10Factorial(2) 
  },

  // 91-100: Extreme Growth
  { 
    id: 'f91', name: 'Double Exponential', formula: '2^(2^n)', description: 'Extremely fast growth.', 
    example: 'n=5, 2^32', growthClass: 'Double-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'A growth rate where the exponent itself grows exponentially.',
    calculateLog10: (n) => Math.pow(2, n) * Math.log10(2) 
  },
  { 
    id: 'f92', name: 'Triple Exponential', formula: '2^(2^(2^n))', description: 'Mind-boggling growth.', 
    example: 'n=3, 2^256', growthClass: 'Triple-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'A growth rate with three nested exponential layers.',
    calculateLog10: (n) => Math.pow(2, Math.pow(2, n)) * Math.log10(2) 
  },
  { 
    id: 'f93', name: 'Ackermann-like', formula: 'n^n^n', description: 'Tower of exponents.', 
    example: 'n=3, 3^27',
    growthClass: 'Triple-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'A function that grows faster than any primitive recursive function.',
    calculateLog10: (n) => Math.pow(n, n) * Math.log10(n) 
  },
  { 
    id: 'f94', name: 'Factorial Tower', formula: '(n!)!', description: 'Factorial of a factorial.', 
    example: 'n=3, 720', growthClass: 'Double-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The factorial function applied to its own output.',
    calculateLog10: (n) => {
      const logNFact = MathUtils.log10Factorial(n);
      const nFact = Math.pow(10, logNFact);
      return MathUtils.log10Factorial(Math.min(nFact, 1e7)); 
    } 
  },
  { 
    id: 'f95', name: 'Super-Factorial', formula: 'sf(n)', description: 'Product of first n factorials.', 
    example: 'n=3, 12', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The product of factorials from 1! to n!.',
    calculateLog10: (n) => {
      let res = 0;
      for(let i=1; i<=n; i++) res += MathUtils.log10Factorial(i);
      return res;
    } 
  },
  { 
    id: 'f96', name: 'Hyper-Power', formula: 'n↑↑2', description: 'n to the power of n.', 
    example: 'n=3, 27', growthClass: 'Super-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The first step in a power tower, where n is raised to itself.',
    calculateLog10: (n) => n * Math.log10(n) 
  },
  { 
    id: 'f97', name: 'Exponential Factorial', formula: 'n^(n!)', description: 'n raised to n factorial.', 
    example: 'n=3, 3^6', growthClass: 'Double-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'A growth rate combining exponential and factorial properties.',
    calculateLog10: (n) => Math.pow(10, MathUtils.log10Factorial(n)) * Math.log10(n) 
  },
  { 
    id: 'f98', name: 'Primorial', formula: 'n#', description: 'Product of primes up to n.', 
    example: 'n=5, 30', growthClass: 'Factorial', category: 'Mathematical Structures',
    detailedExplanation: 'The product of all prime numbers less than or equal to n.',
    calculateLog10: (n) => n / Math.log(10) 
  },
  { 
    id: 'f99', name: 'Busy Beaver Bound', formula: 'Σ(n)', description: 'Non-computable, but bounded by towers.', 
    example: 'n=2, 4', growthClass: 'Triple-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'The maximum number of steps a Turing machine with n states can take before halting.',
    calculateLog10: (n) => Math.pow(2, Math.pow(2, n)) 
  },
  { 
    id: 'f100', name: 'Graham\'s Number Step', formula: '3↑↑n', description: 'Power tower of 3s.', 
    example: 'n=3, 7.6e12', growthClass: 'Triple-Exponential', category: 'Mathematical Structures',
    detailedExplanation: 'A power tower of height n using base 3, representing the first step in constructing Graham\'s number.',
    calculateLog10: (n) => Math.pow(3, n-1) * Math.log10(3) 
  }
];
