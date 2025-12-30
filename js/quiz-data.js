export const quizData = {
    dsa: [
        {
            question: "What is the time complexity of searching in a balanced Binary Search Tree?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
            answer: 1,
            hint: "Think about splitting the search space in half at each step.",
            explanation: "In a balanced BST, each comparison allows you to skip half of the remaining nodes, leading to logarithmic time complexity.",
            timer: 15
        },
        {
            question: "Which data structure is used for Breadth-First Search (BFS)?",
            options: ["Stack", "Queue", "Heap", "Graph"],
            answer: 1,
            hint: "It helps process nodes in a 'first-in, first-out' order.",
            explanation: "BFS explores neighbors level by level, which requires a Queue (FIFO) to keep track of nodes to visit next."
        },
        {
            question: "What is the worst-case time complexity of QuickSort?",
            options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
            answer: 0,
            hint: "This happens when the pivot chosen is always the smallest or largest element.",
            explanation: "If the pivot is poorly chosen (e.g., already sorted array), QuickSort degrades to O(n^2)."
        },
        {
            question: "Which of the following is NOT a linear data structure?",
            options: ["Array", "LinkedList", "Tree", "Stack"],
            answer: 2,
            hint: "Think about hierarchical relationships vs sequential ones.",
            explanation: "A Tree is a hierarchical data structure, whereas Arrays, LinkedLists, and Stacks are linear."
        },
        {
            question: "In a min-heap, the root node always contains the ___ element.",
            options: ["Maximum", "Minimum", "Middle", "Random"],
            answer: 1,
            hint: "The name of the heap gives it away.",
            explanation: "In a Min-Heap, the key at the root must be minimum among all keys present in the Binary Heap."
        },
        {
            question: "What is the time complexity to access an element in an array by index?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
            answer: 0,
            hint: "Arrays store elements in contiguous memory locations.",
            explanation: "Accessing an array element by index is a constant time operation O(1) because the address is calculated directly."
        },
        {
            question: "Which sorting algorithm is known as 'Divide and Conquer'?",
            options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
            answer: 2,
            hint: "It splits the array into halves recursively.",
            explanation: "Merge Sort divides the array into two halves, sorts them, and then merges them back together."
        },
        {
            question: "What does LIFO stand for?",
            options: ["Last In First Out", "Left In First Out", "Last In First Over", "Low In Fast Out"],
            answer: 0,
            hint: "It's the principle behind a Stack.",
            explanation: "LIFO stands for Last In, First Out, which is the operating principle of a Stack data structure."
        },
        {
            question: "Which data structure is best for implementing a priority queue?",
            options: ["Array", "LinkedList", "Heap", "Stack"],
            answer: 2,
            hint: "It allows efficient retrieval of the highest (or lowest) priority element.",
            explanation: "A Heap (specifically a Binary Heap) is the most efficient standard data structure for implementing a Priority Queue."
        },
        {
            question: "What is the space complexity of a recursive algorithm related to?",
            options: ["Number of loops", "Depth of recursion stack", "Number of variables", "Input size only"],
            answer: 1,
            hint: "Each recursive call adds a frame to memory.",
            explanation: "The space complexity is determined by the maximum depth of the recursion stack."
        }
    ],
    cs: [
        {
            question: "What does HTTP stand for?",
            options: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "HyperText Transfer Package", "HyperText Transmission Package"],
            answer: 0,
            hint: "It's the protocol used for transferring web pages.",
            explanation: "HTTP stands for HyperText Transfer Protocol."
        },
        {
            question: "Which layer of the OSI model works with Frames?",
            options: ["Network", "Data Link", "Physical", "Transport"],
            answer: 1,
            hint: "It's the second layer.",
            explanation: "The Data Link layer handles framing, addressing (MAC), and error detection."
        },
        {
            question: "What is the main function of an Operating System?",
            options: ["Compile Code", "Manage Resources", "Design Graphics", "Browse Web"],
            answer: 1,
            hint: "It acts as an intermediary between users and hardware.",
            explanation: "The OS manages computer hardware and software resources and provides common services for computer programs."
        },
        {
            question: "Which register holds the address of the next instruction?",
            options: ["Accumulator", "Program Counter", "Instruction Register", "Stack Pointer"],
            answer: 1,
            hint: "It counts/points to the program's flow.",
            explanation: "The Program Counter (PC) holds the memory address of the next instruction to be fetched."
        },
        {
            question: "What does 'volatile' memory mean?",
            options: ["Permanent", "Lost when power off", "Read-only", "Fastest"],
            answer: 1,
            hint: "Think about what happens to RAM when you unplug the computer.",
            explanation: "Volatile memory (like RAM) requires power to maintain the stored information."
        },
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Standard Query Link", "Simple Question Language", "System Query Logic"],
            answer: 0,
            hint: "It's used for databases.",
            explanation: "SQL stands for Structured Query Language."
        },
        {
            question: "Which protocol is used to send email?",
            options: ["HTTP", "FTP", "SMTP", "POP3"],
            answer: 2,
            hint: "Simple Mail ... Protocol.",
            explanation: "SMTP (Simple Mail Transfer Protocol) is used for sending emails."
        },
        {
            question: "What is the binary representation of decimal 10?",
            options: ["1010", "1001", "1100", "1110"],
            answer: 0,
            hint: "8 + 2",
            explanation: "10 in decimal is 1010 in binary (8*1 + 4*0 + 2*1 + 1*0)."
        },
        {
            question: "Which one is an example of an Input Device?",
            options: ["Monitor", "Printer", "Mouse", "Speaker"],
            answer: 2,
            hint: "You use it to point and click.",
            explanation: "A Mouse is an input device used to provide data and control signals to the computer."
        },
        {
            question: "What does DNS calculate?",
            options: ["Domain Name System", "Data Network Service", "Digital Name Server", "Domain Number System"],
            answer: 0,
            hint: "It translates domain names to IP addresses.",
            explanation: "DNS stands for Domain Name System."
        }
    ],
    wow: [
        {
            question: "What is the speed of light in vacuum?",
            options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "Infinite"],
            answer: 0,
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Light_dispersion_of_a_mercury-vapor_lamp_with_a_prism_of_flint_glass.jpg/320px-Light_dispersion_of_a_mercury-vapor_lamp_with_a_prism_of_flint_glass.jpg",
            hint: "It's approximately 3 x 10^8 meters per second.",
            explanation: "The speed of light in a vacuum is exactly 299,792,458 m/s, often approximated as 300,000 km/s."
        },
        {
            question: "Which planet has the most moons?",
            options: ["Jupiter", "Saturn", "Mars", "Neptune"],
            answer: 1,
            hint: "It's known for its beautiful rings.",
            explanation: "Saturn has the most confirmed moons (over 80), surpassing Jupiter."
        },
        {
            question: "What is the rarest blood type?",
            options: ["O+", "AB-", "A-", "B+"],
            answer: 1,
            hint: "It's a negative type and involves both A and B antigens.",
            explanation: "AB- is considered the rarest blood type in the general population."
        },
        {
            question: "How many bones are in the adult human body?",
            options: ["206", "300", "150", "250"],
            answer: 0,
            hint: "Babies have more, but they fuse together as they grow.",
            explanation: "An adult human skeleton consists of 206 bones."
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            answer: 3,
            hint: "It covers more than 30% of Earth's surface.",
            explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."
        },
        {
            question: "Which element has the chemical symbol 'Au'?",
            options: ["Silver", "Gold", "Copper", "Aluminum"],
            answer: 1,
            hint: "It's a precious yellow metal.",
            explanation: "Au comes from the Latin word 'Aurum', which means Gold."
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
            answer: 2,
            hint: "He was a true Renaissance man.",
            explanation: "Leonardo da Vinci painted the Mona Lisa."
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            answer: 2,
            hint: "It's made of carbon and used in jewelry and cutting tools.",
            explanation: "Diamond is the hardest known natural substance."
        },
        {
            question: "Which country gifted the Statue of Liberty to the USA?",
            options: ["UK", "Germany", "France", "Spain"],
            answer: 2,
            hint: "It was a gift of friendship from the people of...?",
            explanation: "The Statue of Liberty was a gift from the people of France to the United States."
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Orca"],
            answer: 1,
            hint: "It lives in the ocean.",
            explanation: "The Blue Whale is the largest animal known to have ever lived."
        }
    ],
    frontend: [
        {
            question: "What does DOM stand for?",
            options: ["Document Object Model", "Data Object Mode", "Digital Ordinance Model", "Desktop Orientation Module"],
            answer: 0,
            hint: "It represents the page structure as a tree.",
            explanation: "The Document Object Model (DOM) is a programming interface for web documents, treating the page as a tree structure."
        },
        {
            question: "Which CSS property changes text color?",
            options: ["text-color", "color", "font-color", "foreground-color"],
            answer: 1,
            hint: "It's just one word.",
            explanation: "The 'color' property sets the color of the foreground content (text) of an element."
        },
        {
            question: "What is the purpose of the 'z-index' property?",
            options: ["Text size", "Vertical stacking order", "Horizontal alignment", "Zoom level"],
            answer: 1,
            hint: "Think of the Z-axis in 3D space.",
            explanation: "z-index specifies the stack order of an element. An element with greater stack order is always in front of an element with a lower stack order."
        },
        {
            question: "Which HTML tag is used for the largest heading?",
            options: ["<h6>", "<head>", "<h1>", "<header>"],
            answer: 2,
            hint: "Number 1 implies top priority.",
            explanation: "<h1> defines the most important heading."
        },
        {
            question: "What usually wraps a Javascript Promise?",
            options: ["try/catch", "if/else", "Async/Await", "For Loop"],
            answer: 2,
            hint: "Modern syntax for handling asynchronous operations.",
            explanation: "Async/Await is syntax sugar built on top of Promises to make asynchronous code look and behave more like synchronous code."
        }
    ],
    backend: [
        {
            question: "What does API stand for?",
            options: ["Application Programming Interface", "Advanced Program Integration", "Automated Protocol Interaction", "Applied Python Interface"],
            answer: 0,
            hint: "It allows apps to talk to each other.",
            explanation: "API stands for Application Programming Interface."
        },
        {
            question: "Which HTTP method is typically used to update resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            answer: 2,
            hint: "Post creates, Get retrieves...",
            explanation: "PUT (or PATCH) is used to update an existing resource on the server."
        },
        {
            question: "What is a 'Primary Key' in a database?",
            options: ["First column", "Unique identifier", "Largest number", "Admin password"],
            answer: 1,
            hint: "No two rows can have the same value for this.",
            explanation: "A Primary Key uniquely identifies each record in a database table."
        },
        {
            question: "Node.js is built on which JavaScript engine?",
            options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
            answer: 1,
            hint: "It's the same engine Chrome uses.",
            explanation: "Node.js is built on Chrome's V8 JavaScript engine."
        },
        {
            question: "What does 'SQL' injection target?",
            options: ["The frontend UI", "The Network Layer", " The Database", "The Browser Cache"],
            answer: 2,
            hint: "It involves malicious queries.",
            explanation: "SQL injection is a web security vulnerability that allows an attacker to interfere with the queries an application makes to its database."
        }
    ]
};
