
// Institution Dashboard Mock Data
export const institutionMetrics = [
    { title: "Total Students", value: "2,450", change: "+12.5%", trend: "up" },
    { title: "Active Assessments", value: "18", change: "+3", trend: "up" },
    { title: "Avg. Skill Depth", value: "74%", change: "+5.8%", trend: "up" },
    { title: "Active Departments", value: "12", change: "+1", trend: "up" },
];

export const institutionTopStudents = [
    { id: 1, name: "Ayesha Khan", roll: "KIT-2026-056", score: 97 },
    { id: 2, name: "Kritika Roy", roll: "KIT-2026-088", score: 94 },
    { id: 3, name: "Nitin Verma", roll: "KIT-2026-102", score: 99 },
    { id: 4, name: "Rahul Soni", roll: "KIT-2026-012", score: 96 },
    { id: 5, name: "Siddharth J.", roll: "KIT-2026-145", score: 93 },
];

export const recentAssessments = [
    { id: 1, name: "Full Stack Development Challenge", date: "2024-02-15", participants: 180, avgScore: 78 },
    { id: 2, name: "Data Structures & Algorithms", date: "2024-02-10", participants: 245, avgScore: 65 },
    { id: 3, name: "System Design Basics", date: "2024-02-05", participants: 120, avgScore: 82 },
];

export const MOCK_STUDENTS = [
    { id: 6, name: "Ananya Das", email: "ananya.d@kit.edu", id_number: "KIT-2026-156", gpa: "3.4", skill_score: 85, status: "Proficient" },
    { id: 7, name: "Arjun Mehta", email: "arjun.m@kit.edu", id_number: "KIT-2026-001", gpa: "3.2", skill_score: 78, status: "Developing" },
    { id: 2, name: "Ayesha Khan", email: "ayesha.k@kit.edu", id_number: "KIT-2026-056", gpa: "3.8", skill_score: 97, status: "Outstanding" },
    { id: 4, name: "Kritika Roy", email: "kritika.r@kit.edu", id_number: "KIT-2026-088", gpa: "3.6", skill_score: 94, status: "Advanced" },
    { id: 1, name: "Nitin Verma", email: "nitin.v@kit.edu", id_number: "KIT-2026-102", gpa: "3.9", skill_score: 99, status: "Outstanding" },
    { id: 8, name: "Priya Sharma", email: "priya.s@kit.edu", id_number: "KIT-2026-045", gpa: "3.1", skill_score: 72, status: "Developing" },
    { id: 3, name: "Rahul Soni", email: "rahul.s@kit.edu", id_number: "KIT-2026-012", gpa: "3.7", skill_score: 96, status: "Advanced" },
    { id: 5, name: "Siddharth J.", email: "sid.j@kit.edu", id_number: "KIT-2026-145", gpa: "3.5", skill_score: 93, status: "Proficient" },
];

export const MOCK_ASSESSMENTS = [
    { id: 1, title: "Mid-Term CS Fundamentals", status: "Active", date: "Feb 20, 2026", candidates: 145, department: "Computer Science", avgScore: 78 },
    { id: 2, title: "Advanced React Patterns", status: "Completed", date: "Jan 15, 2026", candidates: 89, department: "Software Engineering", avgScore: 82 },
];

// HR / Recruiter Dashboard Mock Data
export const recruiterMetrics = [
    { title: "Open Positions", value: "12", change: "+2", trend: "up" },
    { title: "Total Candidates", value: "854", change: "+145 this week", trend: "up" },
    { title: "Interviews Scheduled", value: "28", change: "Today", trend: "neutral" },
    { title: "Avg. Time to Hire", value: "18 Days", change: "-2 days", trend: "down" },
];

export const recentCandidates = [
    {
        id: 1, name: "Aditya Kumar", email: "aditya.k@bytewave.ai", role: "Senior Frontend Engineer", matchScore: 95, status: "Offer Sent",
        skills: ["React", "TypeScript", "Next.js"], logicScore: 92, patternStrength: 88, optimizationRating: 85,
        videoIntroUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        certificates: [
            { id: "1", title: "Advanced React Patterns", issuer: "Frontend Masters", issueDate: "2025-11-20", badgeType: "Verified", fileUrl: "#", verificationLink: "https://example.com" },
            { id: "2", title: "ByteWave Frontend Challenge", issuer: "ByteWave", issueDate: "2026-01-10", badgeType: "ByteWave Earned", fileUrl: "#" }
        ]
    },
    {
        id: 2, name: "Meera Reddy", email: "meera.r@bytewave.ai", role: "Backend Developer", matchScore: 92, status: "Technical Round",
        skills: ["Go", "Kubernetes", "PostgreSQL"], logicScore: 89, patternStrength: 94, optimizationRating: 90,
        videoIntroUrl: null,
        certificates: [
            { id: "3", title: "CKA: Certified Kubernetes Administrator", issuer: "CNCF", issueDate: "2025-08-15", badgeType: "Verified", fileUrl: "#", verificationLink: "https://example.com" }
        ]
    },
    {
        id: 3, name: "John Doe", email: "john.d@bytewave.ai", role: "Product Manager", matchScore: 88, status: "Screening",
        skills: ["Agile", "JIRA", "Analytics"], logicScore: 78, patternStrength: 82, optimizationRating: 75,
        videoIntroUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        certificates: [
            { id: "4", title: "Agile Scrum Master", issuer: "Scrum Alliance", issueDate: "2024-05-12", badgeType: "Self Uploaded", fileUrl: "#" }
        ]
    },
    {
        id: 4, name: "Sarah Smith", email: "sarah.s@bytewave.ai", role: "UX Designer", matchScore: 85, status: "Portfolio Review",
        skills: ["Figma", "Prototyping"], logicScore: 80, patternStrength: 85, optimizationRating: 70,
        certificates: []
    },
];

export const activeJobs = [
    { id: 1, title: "Senior Frontend Engineer", applicants: 124, status: "Active" },
    { id: 2, title: "Backend Lead", applicants: 45, status: "Active" },
    { id: 3, title: "Data Scientist", applicants: 89, status: "Hold" },
    { id: 4, title: "DevOps Engineer", applicants: 32, status: "Active" },
];

export const MOCK_APPLICATIONS = [
    { id: 1, candidate: "Arjun Mehta", role: "Full Stack Developer", matchScore: 98, status: "Under Review", date: "Feb 24, 2026", email: "arjun.m@bytewave.ai", logicScore: 96, patternStrength: 98, optimizationRating: 95, skills: ["React", "Go", "PostgreSQL", "Docker"] },
    { id: 2, candidate: "Pooja Iyer", role: "Python Developer", matchScore: 82, status: "Screening", date: "Feb 23, 2026", email: "pooja.i@bytewave.ai", logicScore: 82, patternStrength: 85, optimizationRating: 78, skills: ["Python", "Django", "AWS", "Redis"] },
    { id: 3, candidate: "Vikram Singh", role: "C++ Engineer", matchScore: 91, status: "Technical Round", date: "Feb 22, 2026", email: "vikram.s@bytewave.ai", logicScore: 94, patternStrength: 88, optimizationRating: 92, skills: ["C++", "Qt", "Linux", "gRPC"] },
    { id: 4, candidate: "Sneha Patel", role: "Frontend Lead", matchScore: 94, status: "Offer Sent", date: "Feb 21, 2026", email: "sneha.p@bytewave.ai", logicScore: 90, patternStrength: 92, optimizationRating: 88, skills: ["Vue.js", "Tailwind", "Vite", "Pinia"] },
    { id: 5, candidate: "Rohan Gupta", role: "Data Scientist", matchScore: 88, status: "Under Review", date: "Feb 20, 2026", email: "rohan.g@bytewave.ai", logicScore: 85, patternStrength: 90, optimizationRating: 84, skills: ["Python", "PyTorch", "Pandas", "NLP"] },
];

// Student Dashboard Mock Data
export const MOCK_USER_DNA = {
    logicScore: 88,
    patternStrength: 92,
    optimizationRating: 76,
    growthCurve: 14,
    streak: 12,
    byteCoin: 250
};

// ── ARENA PROBLEMS (full detail for each challenge) ──────────────────────────
export interface TestCase {
    id: number;
    input: string;
    expected_output: string;
    explanation?: string;
    isVisible: boolean;
}

export interface ArenaProblem {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    time_est: string;          // "25 mins"
    time_seconds: number;      // 25 * 60
    tags: string[];
    description: string;
    example_input: string;
    example_output: string;
    constraints: string[];
    boilerplates: { python: string; c: string; cpp: string; java: string };
    test_cases: TestCase[];
}

export const ARENA_PROBLEMS: ArenaProblem[] = [
    {
        id: 1, title: "Matrix Spiral Traversal", difficulty: "Medium",
        time_est: "25 mins", time_seconds: 1500,
        tags: ["Array", "Matrix", "Simulation"],
        description: "Given an m×n matrix, return all elements of the matrix in spiral order (clockwise from the outer ring inward).",
        example_input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        example_output: "[1,2,3,6,9,8,7,4,5]",
        constraints: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 10", "-100 ≤ matrix[i][j] ≤ 100"],
        boilerplates: {
            python: `def spiralOrder(matrix):\n    """\n    Time Complexity Target: O(m*n)\n    """\n    # Write your logic here\n    pass`,
            c: `#include <stdio.h>\n#include <stdlib.h>\n\nint* spiralOrder(int** matrix, int matrixSize, int* matrixColSize, int* returnSize) {\n    // Write your logic here\n    *returnSize = 0;\n    return NULL;\n}`,
            cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your logic here\n        return {};\n    }\n};`,
            java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your logic here\n        // Time Complexity Target: O(m*n)\n        return new ArrayList<>();\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "[[1,2,3],[4,5,6],[7,8,9]]", expected_output: "[1,2,3,6,9,8,7,4,5]", isVisible: true, explanation: "Standard 3x3 matrix spiral traversal." },
            { id: 2, input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expected_output: "[1,2,3,4,8,12,11,10,9,5,6,7]", isVisible: true, explanation: "3x4 rectangular matrix." },
            { id: 3, input: "[[1]]", expected_output: "[1]", isVisible: false },
            { id: 4, input: "[[1,2],[3,4]]", expected_output: "[1,2,4,3]", isVisible: false },
            { id: 5, input: "[[1,2,3,4,5]]", expected_output: "[1,2,3,4,5]", isVisible: false },
        ]
    },
    {
        id: 2, title: "Maximum Path Sum in Tree", difficulty: "Hard",
        time_est: "45 mins", time_seconds: 2700,
        tags: ["Tree", "DFS", "Recursion"],
        description: "Given the root of a binary tree, return the maximum path sum. A path is any sequence of nodes from some starting node to any node where each pair of adjacent nodes must have an edge connecting them.",
        example_input: "root = [-10,9,20,null,null,15,7]",
        example_output: "42",
        constraints: ["Number of nodes in the tree: [1, 3×10⁴]", "-1000 ≤ Node.val ≤ 1000"],
        boilerplates: {
            python: `def maxPathSum(root):\n    """\n    Time Complexity Target: O(n)\n    """\n    # Write your logic here\n    pass`,
            c: `#include <stdio.h>\n\nstruct TreeNode { int val; struct TreeNode *left, *right; };\n\nint maxPathSum(struct TreeNode* root) {\n    // Write your logic here\n    return 0;\n}`,
            cpp: `#include <algorithm>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *left, *right; };\n\nclass Solution {\npublic:\n    int maxPathSum(TreeNode* root) {\n        // Write your logic here\n        return 0;\n    }\n};`,
            java: `class Solution {\n    public int maxPathSum(TreeNode root) {\n        // Write your logic here\n        // Time Complexity Target: O(n)\n        return 0;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "[-10,9,20,null,null,15,7]", expected_output: "42", isVisible: true, explanation: "The path 15 -> 20 -> 7 has the maximum sum." },
            { id: 2, input: "[1,2,3]", expected_output: "6", isVisible: true, explanation: "The path 2 -> 1 -> 3 has the maximum sum." },
            { id: 3, input: "[0]", expected_output: "0", isVisible: false },
            { id: 4, input: "[-3]", expected_output: "-3", isVisible: false },
            { id: 5, input: "[2,-1]", expected_output: "2", isVisible: false },
        ]
    },
    {
        id: 3, title: "Valid Parentheses V2", difficulty: "Easy",
        time_est: "15 mins", time_seconds: 900,
        tags: ["Stack", "String"],
        description: "Given a string s containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
        example_input: 's = "()[]{}"',
        example_output: "true",
        constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only"],
        boilerplates: {
            python: `def isValid(s: str) -> bool:\n    """\n    Time Complexity Target: O(n)\n    """\n    # Write your logic here\n    pass`,
            c: `#include <stdbool.h>\n\nbool isValid(char* s) {\n    // Write your logic here\n    return false;\n}`,
            cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your logic here\n        return false;\n    }\n};`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your logic here\n        return false;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: 's = "()[]{}"', expected_output: "true", isVisible: true, explanation: "Standard matched pairs." },
            { id: 2, input: 's = "(]"', expected_output: "false", isVisible: true, explanation: "Mismatched pair." },
            { id: 3, input: 's = "([)]"', expected_output: "false", isVisible: false },
            { id: 4, input: 's = "{[]}"', expected_output: "true", isVisible: false },
            { id: 5, input: 's = "(("', expected_output: "false", isVisible: false },
        ]
    },
    {
        id: 4, title: "LRU Cache Implementation", difficulty: "Hard",
        time_est: "40 mins", time_seconds: 2400,
        tags: ["Design", "HashTable", "LinkedList"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations in O(1) time.",
        example_input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);',
        example_output: "[null,null,null,1,null,-1]",
        constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "0 ≤ value ≤ 10⁵", "O(1) for get and put"],
        boilerplates: {
            python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        # Initialize your data structure\n        pass\n\n    def get(self, key: int) -> int:\n        # Return value or -1\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # Insert/update key\n        pass`,
            c: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct LRUCache { int capacity; } LRUCache;\n\nLRUCache* lRUCacheCreate(int capacity) { return NULL; }\nint lRUCacheGet(LRUCache* obj, int key) { return -1; }\nvoid lRUCachePut(LRUCache* obj, int key, int value) {}`,
            cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {\n        // Initialize here\n    }\n    \n    int get(int key) {\n        return -1;\n    }\n    \n    void put(int key, int value) {\n        \n    }\n};`,
            java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        // Write logic here\n        return -1;\n    }\n    public void put(int key, int value) {\n        // Write logic here\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', expected_output: '[null, null, null, 1, null, -1, null, -1, 3, 4]', isVisible: true, explanation: "Standard LRU sequence with evictions." },
            { id: 2, input: '["LRUCache", "put", "get"]\n[[1], [1, 1], [1]]', expected_output: '[null, null, 1]', isVisible: true },
            { id: 3, input: '["LRUCache", "get"]\n[[1], [1]]', expected_output: '[null, -1]', isVisible: false },
            { id: 4, input: '["LRUCache", "put", "put", "get"]\n[[1], [1,1], [2,2], [1]]', expected_output: '[null, null, null, -1]', isVisible: false },
            { id: 5, input: '["LRUCache", "put", "put", "put", "get", "get"]\n[[2], [1,1], [2,2], [3,3], [1], [2]]', expected_output: '[null, null, null, null, -1, 2]', isVisible: false },
        ]
    },
    {
        id: 5, title: "Two Sum — Sorted Array", difficulty: "Easy",
        time_est: "10 mins", time_seconds: 600,
        tags: ["Array", "Two Pointers", "Binary Search"],
        description: "Given a 1-indexed sorted array of integers numbers, find two numbers that add up to a specific target. Return their indices as [index1, index2] (1-based).",
        example_input: "numbers = [2,7,11,15], target = 9",
        example_output: "[1,2]",
        constraints: ["2 ≤ numbers.length ≤ 3×10⁴", "numbers is non-decreasing", "Exactly one solution exists"],
        boilerplates: {
            python: `def twoSum(numbers, target: int):\n    """\n    Time Complexity Target: O(n)\n    """\n    # Write your logic here\n    pass`,
            c: `int* twoSum(int* numbers, int numbersSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    // Write your logic here\n    return res;\n}`,
            cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        // Write your logic here\n        return {};\n    }\n};`,
            java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Write your logic here\n        return new int[]{0, 0};\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "numbers = [2,7,11,15], target = 9", expected_output: "[1,2]", isVisible: true, explanation: "2 + 7 = 9. Indices are 1 and 2." },
            { id: 2, input: "numbers = [2,3,4], target = 6", expected_output: "[1,3]", isVisible: true, explanation: "2 + 4 = 6. Indices are 1 and 3." },
            { id: 3, input: "numbers = [-1,0], target = -1", expected_output: "[1,2]", isVisible: false },
            { id: 4, input: "numbers = [5,25,75], target = 100", expected_output: "[2,3]", isVisible: false },
            { id: 5, input: "numbers = [1,2,3,4,4,9], target = 8", expected_output: "[4,5]", isVisible: false },
        ]
    },
    {
        id: 6, title: "Longest Substring Without Repeating", difficulty: "Medium",
        time_est: "30 mins", time_seconds: 1800,
        tags: ["String", "Sliding Window", "HashSet"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        example_input: 's = "abcabcbb"',
        example_output: "3  // → \"abc\"",
        constraints: ["0 ≤ s.length ≤ 5×10⁴", "s consists of English letters, digits, symbols and spaces"],
        boilerplates: {
            python: `def lengthOfLongestSubstring(s: str) -> int:\n    """\n    Time Complexity Target: O(n)\n    """\n    # Write your logic here\n    pass`,
            c: `int lengthOfLongestSubstring(char* s) {\n    // Write your logic here\n    return 0;\n}`,
            cpp: `#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your logic here\n        return 0;\n    }\n};`,
            java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your logic here\n        return 0;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: 's = "abcabcbb"', expected_output: "3", isVisible: true, explanation: "The answer is 'abc', with length 3." },
            { id: 2, input: 's = "bbbbb"', expected_output: "1", isVisible: true, explanation: "The answer is 'b', with length 1." },
            { id: 3, input: 's = "pwwkew"', expected_output: "3", isVisible: false },
            { id: 4, input: 's = ""', expected_output: "0", isVisible: false },
            { id: 5, input: 's = " "', expected_output: "1", isVisible: false },
        ]
    },
    {
        id: 7, title: "Word Ladder — BFS Shortest Path", difficulty: "Hard",
        time_est: "50 mins", time_seconds: 3000,
        tags: ["BFS", "Graph", "String"],
        description: "Given beginWord, endWord, and a wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, where each adjacent pair differs by exactly one letter. Return 0 if no path exists.",
        example_input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        example_output: "5  // → hit → hot → dot → dog → cog",
        constraints: ["1 ≤ beginWord.length ≤ 10", "beginWord ≠ endWord", "1 ≤ wordList.length ≤ 5000"],
        boilerplates: {
            python: `from collections import deque\n\ndef ladderLength(beginWord, endWord, wordList) -> int:\n    """\n    Time Complexity Target: O(M² × N)\n    """\n    # Write your logic here\n    pass`,
            c: `#include <stdio.h>\n#include <string.h>\nint ladderLength(char* beginWord, char* endWord, char** wordList, int wordListSize) {\n    // Write your logic here\n    return 0;\n}`,
            cpp: `#include <string>\n#include <vector>\n#include <queue>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your logic here\n        return 0;\n    }\n};`,
            java: `class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your logic here\n        return 0;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', expected_output: "5", isVisible: true, explanation: "hit -> hot -> dot -> dog -> cog" },
            { id: 2, input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', expected_output: "0", isVisible: true, explanation: "endWord 'cog' is not in wordList." },
            { id: 3, input: 'beginWord = "a", endWord = "c", wordList = ["a","b","c"]', expected_output: "2", isVisible: false },
            { id: 4, input: 'beginWord = "hot", endWord = "dog", wordList = ["hot","dog"]', expected_output: "0", isVisible: false },
            { id: 5, input: 'beginWord = "leet", endWord = "code", wordList = ["lest","leet","lose","code","lode","robe","lost"]', expected_output: "0", isVisible: false },
        ]
    },
    {
        id: 8, title: "Coin Change — Min Coins", difficulty: "Medium",
        time_est: "30 mins", time_seconds: 1800,
        tags: ["Dynamic Programming", "Greedy"],
        description: "Given an integer array coins representing coin denominations and an integer amount, return the fewest number of coins needed to make up that amount. Return -1 if it cannot be done.",
        example_input: "coins = [1,5,11], amount = 15",
        example_output: "3  // → 11 + 1 + 1 + 1... wait, use 3 coins: 5+5+5",
        constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹ − 1", "0 ≤ amount ≤ 10⁴"],
        boilerplates: {
            python: `def coinChange(coins, amount: int) -> int:\n    """\n    Time Complexity Target: O(n × amount)\n    """\n    # Write your logic here\n    pass`,
            c: `int coinChange(int* coins, int coinsSize, int amount) {\n    // Write your logic here\n    return -1;\n}`,
            cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your logic here\n        return -1;\n    }\n};`,
            java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your logic here\n        return -1;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "coins = [1,2,5], amount = 11", expected_output: "3", isVisible: true, explanation: "11 = 5 + 5 + 1" },
            { id: 2, input: "coins = [2], amount = 3", expected_output: "-1", isVisible: true, explanation: "Cannot make 3 with denom 2." },
            { id: 3, input: "coins = [1], amount = 0", expected_output: "0", isVisible: false },
            { id: 4, input: "coins = [1], amount = 1", expected_output: "1", isVisible: false },
            { id: 5, input: "coins = [1], amount = 2", expected_output: "2", isVisible: false },
        ]
    },
    {
        id: 9, title: "Merge K Sorted Lists", difficulty: "Hard",
        time_est: "45 mins", time_seconds: 2700,
        tags: ["Heap", "LinkedList", "Divide & Conquer"],
        description: "Given an array of k linked lists, each sorted in ascending order, merge all the linked lists into one sorted linked list and return it.",
        example_input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        example_output: "[1,1,2,3,4,4,5,6]",
        constraints: ["k == lists.length", "0 ≤ k ≤ 10⁴", "0 ≤ lists[i].length ≤ 500"],
        boilerplates: {
            python: `import heapq\n\ndef mergeKLists(lists):\n    """\n    Time Complexity Target: O(N log k)\n    """\n    # Write your logic here\n    pass`,
            c: `struct ListNode { int val; struct ListNode* next; };\nstruct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    // Write your logic here\n    return NULL;\n}`,
            cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nstruct ListNode { int val; ListNode *next; };\n\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your logic here\n        return nullptr;\n    }\n};`,
            java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your logic here\n        return null;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "lists = [[1,4,5],[1,3,4],[2,6]]", expected_output: "[1,1,2,3,4,4,5,6]", isVisible: true, explanation: "Merging three sorted lists." },
            { id: 2, input: "lists = []", expected_output: "[]", isVisible: true, explanation: "Empty input." },
            { id: 3, input: "lists = [[]]", expected_output: "[]", isVisible: false },
            { id: 4, input: "lists = [[1,3,5],[2,4,6]]", expected_output: "[1,2,3,4,5,6]", isVisible: false },
            { id: 5, input: "lists = [[1]]", expected_output: "[1]", isVisible: false },
        ]
    },
    {
        id: 10, title: "Binary Search on Answer", difficulty: "Medium",
        time_est: "20 mins", time_seconds: 1200,
        tags: ["Binary Search", "Array", "Math"],
        description: "Given an array of m × n integers, find the kth smallest element in a row-and-column-sorted matrix (each row and column sorted ascending).",
        example_input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
        example_output: "13",
        constraints: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 300", "1 ≤ k ≤ n²"],
        boilerplates: {
            python: `def kthSmallest(matrix, k: int) -> int:\n    """\n    Time Complexity Target: O(n log(max-min))\n    """\n    # Write your logic here\n    pass`,
            c: `int kthSmallest(int** matrix, int matrixSize, int* matrixColSize, int k) {\n    // Write your logic here\n    return 0;\n}`,
            cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int kthSmallest(vector<vector<int>>& matrix, int k) {\n        // Write your logic here\n        return 0;\n    }\n};`,
            java: `class Solution {\n    public int kthSmallest(int[][] matrix, int k) {\n        // Write your logic here\n        return 0;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8", expected_output: "13", isVisible: true, explanation: "The 8th smallest element is 13." },
            { id: 2, input: "matrix = [[-5]], k = 1", expected_output: "-5", isVisible: true },
            { id: 3, input: "matrix = [[1,2],[3,4]], k = 2", expected_output: "2", isVisible: false },
            { id: 4, input: "matrix = [[1,2],[3,4]], k = 3", expected_output: "3", isVisible: false },
            { id: 5, input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 1", expected_output: "1", isVisible: false },
        ]
    },
    {
        id: 11, title: "Flood Fill Algorithm", difficulty: "Easy",
        time_est: "15 mins", time_seconds: 900,
        tags: ["BFS", "DFS", "Matrix"],
        description: "Given an image (m×n grid of integers), a starting pixel (sr, sc), and a new color, perform a flood fill. Change the color of the starting pixel and all adjacent pixels of the same original color.",
        example_input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
        example_output: "[[2,2,2],[2,2,0],[2,0,1]]",
        constraints: ["m == image.length", "n == image[i].length", "1 ≤ m, n ≤ 50", "0 ≤ image[i][j] ≤ 65535"],
        boilerplates: {
            python: `def floodFill(image, sr: int, sc: int, color: int):\n    """\n    Time Complexity Target: O(m*n)\n    """\n    # Write your logic here\n    pass`,
            c: `int** floodFill(int** image, int imageSize, int* imageColSize, int sr, int sc, int color, int* returnSize, int** returnColumnSizes) {\n    // Write your logic here\n    return image;\n}`,
            cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        // Write your logic here\n        return image;\n    }\n};`,
            java: `class Solution {\n    public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n        // Write your logic here\n        return image;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", expected_output: "[[2,2,2],[2,2,0],[2,0,1]]", isVisible: true, explanation: "Flows from (1,1) to all connected 1s." },
            { id: 2, input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", expected_output: "[[0,0,0],[0,0,0]]", isVisible: true, explanation: "Target color is same as current." },
            { id: 3, input: "image = [[1]], sr = 0, sc = 0, color = 2", expected_output: "[[2]]", isVisible: false },
            { id: 4, input: "image = [[1,0],[0,1]], sr = 0, sc = 0, color = 2", expected_output: "[[2,0],[0,1]]", isVisible: false },
            { id: 5, input: "image = [[1,1],[1,1]], sr = 0, sc = 0, color = 3", expected_output: "[[3,3],[3,3]]", isVisible: false },
        ]
    },
    {
        id: 12, title: "Trapping Rain Water", difficulty: "Hard",
        time_est: "40 mins", time_seconds: 2400,
        tags: ["Array", "Two Pointers", "Stack"],
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        example_input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        example_output: "6",
        constraints: ["n == height.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ height[i] ≤ 10⁵"],
        boilerplates: {
            python: `def trap(height) -> int:\n    """\n    Time Complexity Target: O(n), Space: O(1)\n    """\n    # Write your logic here\n    pass`,
            c: `int trap(int* height, int heightSize) {\n    // Write your logic here\n    return 0;\n}`,
            cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your logic here\n        return 0;\n    }\n};`,
            java: `class Solution {\n    public int trap(int[] height) {\n        // Write your logic here\n        return 0;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expected_output: "6", isVisible: true, explanation: "Standard elevation map trap." },
            { id: 2, input: "height = [4,2,0,3,2,5]", expected_output: "9", isVisible: true },
            { id: 3, input: "height = [1,1,1]", expected_output: "0", isVisible: false },
            { id: 4, input: "height = [3,0,3]", expected_output: "3", isVisible: false },
            { id: 5, input: "height = []", expected_output: "0", isVisible: false },
        ]
    },
    {
        id: 13, title: "Group Anagrams", difficulty: "Medium",
        time_est: "25 mins", time_seconds: 1500,
        tags: ["String", "HashMap", "Sorting"],
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        example_input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        example_output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "strs[i] consists of lowercase English letters"],
        boilerplates: {
            python: `from collections import defaultdict\n\ndef groupAnagrams(strs):\n    """\n    Time Complexity Target: O(n × k log k)\n    """\n    # Write your logic here\n    pass`,
            c: `char*** groupAnagrams(char** strs, int strsSize, int* returnSize, int** returnColumnSizes) {\n    // Write your logic here\n    return NULL;\n}`,
            cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your logic here\n        return {};\n    }\n};`,
            java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your logic here\n        return new ArrayList<>();\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expected_output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isVisible: true, explanation: "Grouping by sorted characters." },
            { id: 2, input: 'strs = [""]', expected_output: '[[""]]', isVisible: true },
            { id: 3, input: 'strs = ["a"]', expected_output: '[["a"]]', isVisible: false },
            { id: 4, input: 'strs = ["hi","ih","bye"]', expected_output: '[["bye"],["hi","ih"]]', isVisible: false },
            { id: 5, input: 'strs = ["abc","cba","bac","xyz"]', expected_output: '[["abc","bac","cba"],["xyz"]]', isVisible: false },
        ]
    },
    {
        id: 14, title: "Detect Cycle in Directed Graph", difficulty: "Medium",
        time_est: "35 mins", time_seconds: 2100,
        tags: ["Graph", "DFS", "Topological Sort"],
        description: "Given numCourses and an array prerequisites where prerequisites[i] = [ai, bi] means you must take bi before ai, return true if you can finish all courses (i.e., the graph has no cycle).",
        example_input: "numCourses = 2, prerequisites = [[1,0]]",
        example_output: "true",
        constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000", "No duplicate prerequisites"],
        boilerplates: {
            python: `def canFinish(numCourses: int, prerequisites) -> bool:\n    """\n    Time Complexity Target: O(V + E)\n    """\n    # Write your logic here\n    pass`,
            c: `#include <stdbool.h>\nbool canFinish(int numCourses, int** prerequisites, int prerequisitesSize, int* prerequisitesColSize) {\n    // Write your logic here\n    return true;\n}`,
            cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your logic here\n        return true;\n    }\n};`,
            java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your logic here\n        return true;\n    }\n}`,
        },
        test_cases: [
            { id: 1, input: "numCourses = 2, prerequisites = [[1,0]]", expected_output: "true", isVisible: true, explanation: "Possible to finish 0 then 1." },
            { id: 2, input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", expected_output: "false", isVisible: true, explanation: "Cyclic dependency." },
            { id: 3, input: "numCourses = 3, prerequisites = [[1,0],[2,1]]", expected_output: "true", isVisible: false },
            { id: 4, input: "numCourses = 3, prerequisites = [[1,0],[0,1]]", expected_output: "false", isVisible: false },
            { id: 5, input: "numCourses = 1, prerequisites = []", expected_output: "true", isVisible: false },
        ]
    },
];

// Lightweight alias kept for backward compat
export const MOCK_CHALLENGES = ARENA_PROBLEMS.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    time_est: p.time_est,
    tags: p.tags,
}));



// ── TOP PERFORMERS / LEADERBOARD ─────────────────────────────────────────────
export interface LeaderboardMember {
    id: number;
    name: string;
    username: string;
    role: 'Student' | 'Recruiter' | 'Institution';
    avatar: string;          // emoji fallback
    problems_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    xp: number;
    streak: number;
    skill_score: number;
    rank_badge: 'S' | 'A' | 'B' | 'C';
    languages: string[];
    badge: string;           // special title
    change: number;          // rank change this week (+/-)
}

export const LEADERBOARD_MEMBERS: LeaderboardMember[] = [
    {
        id: 1, name: "Arjun Mehta", username: "@arjun_m", role: "Student",
        avatar: "AM", problems_solved: 847, easy_solved: 312, medium_solved: 390, hard_solved: 145,
        xp: 12480, streak: 32, skill_score: 98, rank_badge: "S",
        languages: ["Python", "C++", "Java"], badge: "⚡ Code God", change: 0,
    },
    {
        id: 2, name: "Priya Sharma", username: "@priya_s", role: "Student",
        avatar: "PS", problems_solved: 792, easy_solved: 290, medium_solved: 365, hard_solved: 137,
        xp: 11200, streak: 28, skill_score: 96, rank_badge: "S",
        languages: ["Java", "Go", "Python"], badge: "🔥 Streak King", change: 1,
    },
    {
        id: 3, name: "Aditya Kumar", username: "@aditya_k", role: "Recruiter",
        avatar: "AK", problems_solved: 741, easy_solved: 271, medium_solved: 345, hard_solved: 125,
        xp: 10350, streak: 21, skill_score: 95, rank_badge: "S",
        languages: ["TypeScript", "Python", "Rust"], badge: "🧠 Recursion Pro", change: -1,
    },
    {
        id: 4, name: "Meera Reddy", username: "@meera_r", role: "Recruiter",
        avatar: "MR", problems_solved: 689, easy_solved: 240, medium_solved: 321, hard_solved: 128,
        xp: 9870, streak: 19, skill_score: 94, rank_badge: "A",
        languages: ["Go", "Kotlin", "C#"], badge: "🎯 Precision Coder", change: 2,
    },
    {
        id: 5, name: "Sneha Patel", username: "@sneha_p", role: "Student",
        avatar: "SP", problems_solved: 635, easy_solved: 220, medium_solved: 298, hard_solved: 117,
        xp: 9100, streak: 14, skill_score: 92, rank_badge: "A",
        languages: ["Python", "React", "Swift"], badge: "💡 Pattern Master", change: 0,
    },
    {
        id: 6, name: "Vikram Singh", username: "@vikram_s", role: "Student",
        avatar: "VS", problems_solved: 581, easy_solved: 198, medium_solved: 274, hard_solved: 109,
        xp: 8420, streak: 11, skill_score: 91, rank_badge: "A",
        languages: ["C", "C++", "Python"], badge: "🛡️ Security Expert", change: 1,
    },
    {
        id: 7, name: "Rohan Gupta", username: "@rohan_g", role: "Student",
        avatar: "RG", problems_solved: 524, easy_solved: 175, medium_solved: 248, hard_solved: 101,
        xp: 7650, streak: 9, skill_score: 88, rank_badge: "A",
        languages: ["Python", "R", "SQL"], badge: "📊 Data Wizard", change: -2,
    },
    {
        id: 8, name: "Ananya Das", username: "@ananya_d", role: "Student",
        avatar: "AD", problems_solved: 467, easy_solved: 161, medium_solved: 219, hard_solved: 87,
        xp: 6900, streak: 7, skill_score: 85, rank_badge: "B",
        languages: ["JavaScript", "Python", "CSS"], badge: "🎨 UI Engineer", change: 3,
    },
    {
        id: 9, name: "John Doe", username: "@john_d", role: "Recruiter",
        avatar: "JD", problems_solved: 412, easy_solved: 148, medium_solved: 196, hard_solved: 68,
        xp: 6100, streak: 5, skill_score: 82, rank_badge: "B",
        languages: ["Python", "SQL", "JIRA"], badge: "🚀 Product Thinker", change: 0,
    },
    {
        id: 10, name: "Sarah Smith", username: "@sarah_sm", role: "Recruiter",
        avatar: "SS", problems_solved: 358, easy_solved: 131, medium_solved: 172, hard_solved: 55,
        xp: 5300, streak: 4, skill_score: 80, rank_badge: "B",
        languages: ["Figma", "HTML", "CSS"], badge: "✏️ Design Coder", change: -1,
    },
    {
        id: 11, name: "Karthik Nair", username: "@karthik_n", role: "Student",
        avatar: "KN", problems_solved: 295, easy_solved: 110, medium_solved: 140, hard_solved: 45,
        xp: 4400, streak: 3, skill_score: 77, rank_badge: "B",
        languages: ["Java", "Kotlin"], badge: "📱 App Developer", change: 2,
    },
    {
        id: 12, name: "Divya Menon", username: "@divya_m", role: "Student",
        avatar: "DM", problems_solved: 218, easy_solved: 89, medium_solved: 102, hard_solved: 27,
        xp: 3200, streak: 2, skill_score: 75, rank_badge: "C",
        languages: ["Python", "Django"], badge: "🌱 Rising Star", change: 4,
    },
    {
        id: 13, name: "Nikhil Joshi", username: "@nikhil_j", role: "Student",
        avatar: "NJ", problems_solved: 156, easy_solved: 72, medium_solved: 68, hard_solved: 16,
        xp: 2300, streak: 1, skill_score: 72, rank_badge: "C",
        languages: ["C", "C++"], badge: "🔧 Systems Learner", change: -1,
    },
    {
        id: 14, name: "Pooja Iyer", username: "@pooja_i", role: "Student",
        avatar: "PI", problems_solved: 94, easy_solved: 45, medium_solved: 40, hard_solved: 9,
        xp: 1400, streak: 0, skill_score: 68, rank_badge: "C",
        languages: ["Python", "SQL"], badge: "🌟 Newcomer", change: 0,
    },
];
