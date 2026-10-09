import random

# Local MCQ bank: 5 questions for each of the 30 supported skills.
# Each question is: (question_text, [four_options], correct_answer)
QUESTION_BANK = {
    "C": [
        ("Which header declares printf()?", ["stdio.h", "stdlib.h", "string.h", "math.h"], "stdio.h"),
        ("What is the first valid index of a C array?", ["0", "1", "-1", "Depends on the array"], "0"),
        ("Which operator accesses a structure member through a pointer?", [".", "->", "::", "&"], "->"),
        ("Which function allocates memory dynamically in C?", ["malloc()", "printf()", "strlen()", "fopen()"], "malloc()"),
        ("Which character terminates a C string?", ["\\0", "\\n", "\\t", "EOF"], "\\0"),
    ],
    "C++": [
        ("Which feature allows functions to share a name but use different parameter lists?", ["Overloading", "Inheritance", "Encapsulation", "Casting"], "Overloading"),
        ("Which keyword allocates an object dynamically in C++?", ["new", "create", "alloc", "object"], "new"),
        ("Which standard container stores unique sorted keys?", ["vector", "map", "queue", "list"], "map"),
        ("Which symbol begins a single-line comment in C++?", ["//", "<!--", "#", "**"], "//"),
        ("Which concept allows a derived class to redefine a virtual method?", ["Polymorphism", "Compilation", "Tokenization", "Namespacing"], "Polymorphism"),
    ],
    "Java": [
        ("Which keyword is used to inherit a class?", ["implements", "extends", "inherits", "super"], "extends"),
        ("Which primitive type stores true or false?", ["int", "boolean", "char", "float"], "boolean"),
        ("Which collection does not allow duplicate elements?", ["ArrayList", "HashSet", "LinkedList", "Vector"], "HashSet"),
        ("Which keyword prevents a class from being subclassed?", ["static", "final", "private", "abstract"], "final"),
        ("Which method is the usual Java application entry point?", ["start()", "run()", "main()", "init()"], "main()"),
    ],
    "Python": [
        ("Which keyword defines a function?", ["func", "def", "function", "define"], "def"),
        ("What does len([4, 5, 6]) return?", ["2", "3", "4", "6"], "3"),
        ("Which built-in type is immutable?", ["list", "dict", "set", "tuple"], "tuple"),
        ("What is the result of 2 ** 3?", ["5", "6", "8", "9"], "8"),
        ("Which keyword is used to handle an exception?", ["catch", "except", "error", "handle"], "except"),
    ],
    "JavaScript": [
        ("Which operator checks strict equality?", ["=", "==", "===", "!="], "==="),
        ("Which array method returns a new array by transforming each item?", ["map()", "push()", "pop()", "forEach()"], "map()"),
        ("Which keyword declares a reassignable block-scoped variable?", ["const", "let", "static", "define"], "let"),
        ("Which method converts a JSON string into a JavaScript value?", ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.read()"], "JSON.parse()"),
        ("What does typeof 42 return?", ["number", "integer", "float", "numeric"], "number"),
    ],
    "HTML": [
        ("Which element creates a hyperlink?", ["<link>", "<a>", "<href>", "<url>"], "<a>"),
        ("Which attribute provides alternative text for an image?", ["src", "href", "alt", "target"], "alt"),
        ("Which element represents a standalone article?", ["<article>", "<span>", "<footer>", "<br>"], "<article>"),
        ("Which element creates an unordered list?", ["<ol>", "<ul>", "<li>", "<dl>"], "<ul>"),
        ("Which attribute connects a label to a form control by its id?", ["for", "src", "action", "target"], "for"),
    ],
    "CSS": [
        ("Which selector targets id='main'?", [".main", "#main", "main()", "*main"], "#main"),
        ("Which declaration enables Flexbox?", ["position: flex", "display: flex", "flex: display", "layout: flex"], "display: flex"),
        ("Which unit is relative to the root element's font size?", ["px", "em", "rem", "vh"], "rem"),
        ("Which property controls the space inside an element's border?", ["margin", "padding", "outline", "gap-only"], "padding"),
        ("Which at-rule is commonly used for responsive media queries?", ["@media", "@responsive", "@screen", "@device"], "@media"),
    ],
    "React": [
        ("Which hook manages local state in a function component?", ["useRoute", "useState", "useClass", "useStyle"], "useState"),
        ("Which prop helps React identify list items between renders?", ["key", "idOnly", "indexKey", "refOnly"], "key"),
        ("How does a parent commonly pass data to a child component?", ["Props", "CSS variables only", "DOM queries only", "Imports at runtime only"], "Props"),
        ("Which hook is intended for synchronizing with external systems?", ["useEffect", "useMarkup", "useHTML", "useRender"], "useEffect"),
        ("What syntax is commonly used to describe UI in React?", ["JSX", "SQL", "YAML", "XML Schema"], "JSX"),
    ],
    "Node.js": [
        ("What is Node.js primarily used for?", ["Running JavaScript outside the browser", "Styling HTML", "Writing SQL only", "Creating CSS selectors"], "Running JavaScript outside the browser"),
        ("Which object exposes environment variables?", ["process.env", "window.env", "document.env", "app.variables"], "process.env"),
        ("Which built-in module provides filesystem operations?", ["http", "fs", "eventsOnly", "urlOnly"], "fs"),
        ("Which file commonly lists a Node project's dependencies and scripts?", ["package.json", "index.css", "requirements.txt", "Cargo.toml"], "package.json"),
        ("Which Node.js design feature helps handle many I/O operations?", ["Event loop", "One thread per request by default", "Blocking every socket", "Manual browser rendering"], "Event loop"),
    ],
    "Django": [
        ("Which file commonly defines Django models?", ["views.py", "models.py", "urls.py", "admin.html"], "models.py"),
        ("Which command starts Django's development server?", ["python manage.py runserver", "django start", "npm run django", "python server.py"], "python manage.py runserver"),
        ("Which component maps URL patterns to views?", ["URLconf", "Template filter", "Migration", "Model field"], "URLconf"),
        ("Which Django feature helps protect POST forms against cross-site request forgery?", ["CSRF protection", "Static files", "Model ordering", "Pagination"], "CSRF protection"),
        ("Which command creates migration files after model changes?", ["python manage.py makemigrations", "python manage.py collectstatic", "python manage.py createsuperuser", "python manage.py shell"], "python manage.py makemigrations"),
    ],
    "Machine Learning": [
        ("Which task predicts a continuous numerical value?", ["Regression", "Classification", "Clustering", "Association"], "Regression"),
        ("What is overfitting?", ["Good training performance but poor generalization", "Training without data", "Removing all features", "Always improving test accuracy"], "Good training performance but poor generalization"),
        ("Which learning type uses labeled examples?", ["Supervised learning", "Unsupervised learning", "Reinforcement learning only", "Random search"], "Supervised learning"),
        ("What is a test set mainly used for?", ["Evaluating generalization on held-out data", "Fitting every model parameter", "Replacing the training set permanently", "Storing source code"], "Evaluating generalization on held-out data"),
        ("Which metric is commonly used for classification accuracy?", ["Correct predictions divided by total predictions", "Sum of all feature values", "Number of model parameters", "Training time multiplied by rows"], "Correct predictions divided by total predictions"),
    ],
    "Deep Learning": [
        ("What is a basic computational unit in an artificial neural network?", ["Neuron", "Database row", "Router", "Compiler"], "Neuron"),
        ("Which architecture is commonly used for image feature extraction?", ["CNN", "FIFO", "DNS", "B-tree"], "CNN"),
        ("What is backpropagation used for?", ["Computing gradients for training", "Compressing images only", "Sorting datasets", "Creating database tables"], "Computing gradients for training"),
        ("What is an epoch in model training?", ["One pass through the training dataset", "One neuron", "A loss function only", "A type of database"], "One pass through the training dataset"),
        ("Why are activation functions used in neural networks?", ["To introduce non-linearity", "To sort input rows", "To store labels on disk", "To guarantee zero training time"], "To introduce non-linearity"),
    ],
    "Artificial Intelligence": [
        ("Which search algorithm uses a heuristic to guide exploration?", ["A*", "Linear search", "Bubble sort", "FIFO scheduling"], "A*"),
        ("What does NLP stand for?", ["Natural Language Processing", "Network Link Protocol", "Numerical Logic Program", "Node Language Package"], "Natural Language Processing"),
        ("What is an expert system designed to use?", ["Rules and domain knowledge", "Only CSS styles", "Network cables", "Database indexes exclusively"], "Rules and domain knowledge"),
        ("In AI, what is an agent?", ["An entity that perceives and acts in an environment", "A database column", "A programming comment", "A CSS selector"], "An entity that perceives and acts in an environment"),
        ("Which technique represents problems as states and possible actions?", ["State-space search", "Text styling", "Database normalization only", "Packet switching"], "State-space search"),
    ],
    "Data Science": [
        ("Which Python library is commonly used for tabular data analysis?", ["Pandas", "Turtle", "Pygame", "Tkinter"], "Pandas"),
        ("What is the purpose of data cleaning?", ["Handling quality issues in data", "Increasing file size", "Deleting every column", "Replacing analysis with visualization"], "Handling quality issues in data"),
        ("Which measure is generally less affected by extreme values?", ["Median", "Mean", "Range", "Maximum"], "Median"),
        ("Which chart is often useful for examining the relationship between two numeric variables?", ["Scatter plot", "Pie chart only", "Word cloud", "Gantt chart"], "Scatter plot"),
        ("What is exploratory data analysis used for?", ["Understanding patterns and structure in data", "Deploying a router", "Encrypting passwords", "Compiling Java"], "Understanding patterns and structure in data"),
    ],
    "SQL": [
        ("Which command retrieves records from a table?", ["SELECT", "INSERT", "DROP", "UPDATE"], "SELECT"),
        ("Which clause filters grouped results?", ["WHERE", "HAVING", "ORDER BY", "LIMIT"], "HAVING"),
        ("Which aggregate function counts rows?", ["COUNT()", "SUM()", "AVG()", "ROUND()"], "COUNT()"),
        ("Which constraint uniquely identifies each row and disallows NULL?", ["PRIMARY KEY", "CHECK", "DEFAULT", "INDEX only"], "PRIMARY KEY"),
        ("Which join returns rows with matching values in both tables?", ["INNER JOIN", "CROSS JOIN", "FULL OUTER JOIN", "LEFT JOIN with no match"], "INNER JOIN"),
    ],
    "MongoDB": [
        ("What binary-encoded document format is commonly used internally by MongoDB?", ["BSON", "CSV only", "Plain CSS", "INI"], "BSON"),
        ("Which method inserts one document into a collection?", ["insertOne()", "addRow()", "pushTable()", "createColumn()"], "insertOne()"),
        ("What is the default document identifier field called?", ["_id", "idKey", "primary", "docId"], "_id"),
        ("Which query method retrieves matching documents?", ["find()", "selectRows()", "getTable()", "scanSQL()"], "find()"),
        ("What is a MongoDB collection most similar to in a relational database?", ["Table", "Column", "Stored procedure", "Foreign key"], "Table"),
    ],
    "Authentication": [
        ("What is the purpose of password hashing?", ["Store a one-way password representation", "Encrypt every network packet", "Replace authorization", "Make passwords publicly readable"], "Store a one-way password representation"),
        ("What does multi-factor authentication require?", ["Two or more different authentication factors", "Two usernames", "Multiple database tables", "A longer URL"], "Two or more different authentication factors"),
        ("What is the purpose of an access token?", ["Represent granted access to protected resources", "Store CSS styles", "Compile source code", "Create database indexes"], "Represent granted access to protected resources"),
        ("Why should passwords not be stored as plaintext?", ["A database leak would expose the original passwords directly", "Plaintext is required for HTTPS", "It prevents all SQL queries", "It makes usernames unnecessary"], "A database leak would expose the original passwords directly"),
        ("What is authorization?", ["Determining what an authenticated user is allowed to do", "Checking whether a password matches", "Generating a random username", "Encoding a URL"], "Determining what an authenticated user is allowed to do"),
    ],
    "REST API": [
        ("Which HTTP method is commonly used to retrieve a resource?", ["GET", "POST", "PATCH", "DELETE"], "GET"),
        ("Which status code commonly indicates successful resource creation?", ["200", "201", "400", "500"], "201"),
        ("What does statelessness mean in REST?", ["Each request carries the context needed to process it", "The server must store every client interaction in session memory", "Clients cannot send headers", "Resources cannot change"], "Each request carries the context needed to process it"),
        ("Which status code indicates the client is not authenticated?", ["401", "201", "301", "503"], "401"),
        ("Which HTTP method is generally intended for a partial resource update?", ["PATCH", "GET", "TRACE", "OPTIONS"], "PATCH"),
    ],
    "Git": [
        ("Which command creates a new commit?", ["git commit", "git clone", "git status", "git fetch"], "git commit"),
        ("Which command shows the working tree status?", ["git status", "git merge", "git init", "git tag"], "git status"),
        ("Which command creates a branch named feature?", ["git branch feature", "git push feature", "git status feature", "git init feature"], "git branch feature"),
        ("Which command downloads remote changes without merging them into the current branch?", ["git fetch", "git commit", "git stash pop", "git init"], "git fetch"),
        ("Which command copies a remote repository to your machine?", ["git clone", "git status", "git diff", "git log"], "git clone"),
    ],
    "GitHub": [
        ("What is a pull request primarily used for?", ["Proposing and reviewing changes", "Running a local compiler", "Creating a CSS class", "Resetting a password"], "Proposing and reviewing changes"),
        ("What is a repository?", ["A project location containing files and version history", "A programming loop", "A network protocol", "A database query"], "A project location containing files and version history"),
        ("What can GitHub Actions automate?", ["Tasks such as testing and deployment", "Only manual code editing", "Physical hardware repair", "Monitor resolution changes"], "Tasks such as testing and deployment"),
        ("What is a README commonly used for?", ["Explaining a project's purpose and usage", "Storing private passwords", "Replacing all source files", "Running SQL automatically"], "Explaining a project's purpose and usage"),
        ("What is a fork on GitHub?", ["A personal copy of a repository under another account or namespace", "A deleted commit", "A programming exception", "A deployment secret"], "A personal copy of a repository under another account or namespace"),
    ],
    "Data Structures": [
        ("Which data structure follows LIFO?", ["Stack", "Queue", "Graph", "Priority table"], "Stack"),
        ("Which data structure follows FIFO?", ["Queue", "Stack", "Tree", "Set"], "Queue"),
        ("Which structure organizes nodes in parent-child relationships?", ["Tree", "Queue", "Hash function", "Array index"], "Tree"),
        ("Which structure commonly provides average O(1) key lookup with a good hash function?", ["Hash table", "Linked list", "Unbalanced array scan", "Stack"], "Hash table"),
        ("Which data structure is composed of vertices and edges?", ["Graph", "Stack", "Queue", "Scalar"], "Graph"),
    ],
    "Algorithms": [
        ("What is binary search's time complexity on a sorted array?", ["O(log n)", "O(n)", "O(n²)", "O(1) in every case"], "O(log n)"),
        ("Which sorting algorithm repeatedly selects the smallest remaining element?", ["Selection sort", "Binary search", "BFS", "Merge join"], "Selection sort"),
        ("Which technique combines solutions to smaller subproblems?", ["Divide and conquer", "Random guessing", "Linear probing only", "Deadlock prevention"], "Divide and conquer"),
        ("Which graph traversal commonly uses a queue?", ["BFS", "DFS", "Binary search", "Insertion sort"], "BFS"),
        ("What is the worst-case time complexity of linear search over n items?", ["O(n)", "O(log n)", "O(1)", "O(n log n)"], "O(n)"),
    ],
    "DBMS": [
        ("What does a primary key ensure?", ["Uniquely identifies each row", "Allows duplicate identifiers", "Sorts every query automatically", "Encrypts all columns"], "Uniquely identifies each row"),
        ("Which ACID property means a transaction is all-or-nothing?", ["Atomicity", "Consistency", "Isolation", "Durability"], "Atomicity"),
        ("What is normalization intended to reduce?", ["Data redundancy and update anomalies", "All database security", "Every query", "The number of users"], "Data redundancy and update anomalies"),
        ("What is a foreign key used for?", ["Representing a relationship to a key in another or the same table", "Encrypting a table", "Sorting every row", "Replacing all indexes"], "Representing a relationship to a key in another or the same table"),
        ("Which SQL command removes rows while keeping the table structure?", ["DELETE", "DROP", "CREATE", "ALTER"], "DELETE"),
    ],
    "Operating Systems": [
        ("Which scheduling algorithm uses a fixed time quantum?", ["Round Robin", "FCFS only", "Shortest Job First only", "Page replacement"], "Round Robin"),
        ("What is a deadlock?", ["Processes waiting indefinitely for resources held by each other", "A successful program termination", "A disk formatting method", "A compiler type"], "Processes waiting indefinitely for resources held by each other"),
        ("Which memory technique divides memory into fixed-size pages?", ["Paging", "Spooling", "Polling", "Linking"], "Paging"),
        ("Which component chooses a process to run next on the CPU?", ["CPU scheduler", "Assembler", "Text editor", "File compressor"], "CPU scheduler"),
        ("What is a context switch?", ["Saving one execution context and restoring another", "Deleting the operating system", "Formatting RAM", "Changing a file extension"], "Saving one execution context and restoring another"),
    ],
    "Computer Networks": [
        ("Which protocol translates domain names into IP addresses?", ["DNS", "FTP", "SMTP", "SSH"], "DNS"),
        ("Which transport protocol provides reliable, ordered delivery?", ["TCP", "UDP", "ARP", "ICMP"], "TCP"),
        ("Which device forwards packets between different IP networks?", ["Router", "Hub", "Repeater", "Keyboard"], "Router"),
        ("Which protocol automatically assigns IP configuration to clients?", ["DHCP", "HTTP", "SMTP", "SNMP trap only"], "DHCP"),
        ("Which OSI layer is associated with routing between networks?", ["Network layer", "Physical layer", "Presentation layer", "Application layer"], "Network layer"),
    ],
    "Cybersecurity": [
        ("What is phishing?", ["A deceptive attempt to steal sensitive information", "A disk scheduling method", "A database join", "A compression algorithm"], "A deceptive attempt to steal sensitive information"),
        ("What does least privilege mean?", ["Grant only the access needed for a task", "Give everyone administrator rights", "Share all passwords", "Disable access controls"], "Grant only the access needed for a task"),
        ("Why is HTTPS used?", ["To protect HTTP communication using TLS", "To remove every website vulnerability", "To replace DNS", "To guarantee a website is honest"], "To protect HTTP communication using TLS"),
        ("What is a brute-force attack?", ["Repeatedly trying candidate credentials or keys", "Compressing a file", "Updating a browser", "Backing up a database"], "Repeatedly trying candidate credentials or keys"),
        ("What is the purpose of a software security update?", ["Fix known vulnerabilities and other defects", "Guarantee no future attack is possible", "Remove the need for backups", "Replace authentication with encryption"], "Fix known vulnerabilities and other defects"),
    ],
    "Cloud Computing": [
        ("Which cloud model provides virtual machines and networking resources?", ["IaaS", "SaaS", "PaaS only", "HTML"], "IaaS"),
        ("What is auto-scaling?", ["Adjusting resources based on demand or policies", "Manually rewriting application code", "Deleting all backups", "Changing a domain name"], "Adjusting resources based on demand or policies"),
        ("What does SaaS provide?", ["Software applications as a service", "Only physical cables", "A programming language", "A local disk partition"], "Software applications as a service"),
        ("What is a cloud availability zone generally intended to provide?", ["A distinct failure domain within a cloud region", "A programming syntax", "A database column", "A browser extension"], "A distinct failure domain within a cloud region"),
        ("What is serverless computing?", ["A model where the provider manages much of the server infrastructure", "Computing without any physical servers", "A local-only spreadsheet", "A type of HTML element"], "A model where the provider manages much of the server infrastructure"),
    ],
    "Docker": [
        ("What is a Docker image?", ["A template used to create containers", "A running process only", "A Git branch", "A database query"], "A template used to create containers"),
        ("Which command builds an image from a Dockerfile?", ["docker build", "docker pull", "docker ps", "docker logs"], "docker build"),
        ("What is a container?", ["An isolated runtime instance created from an image", "A source-code editor", "A network switch", "A SQL index"], "An isolated runtime instance created from an image"),
        ("Which command lists running containers?", ["docker ps", "docker build", "docker image prune", "docker login"], "docker ps"),
        ("What is the purpose of a Dockerfile?", ["Describe steps to build an image", "Store Git commit history", "Define SQL tables", "Configure browser CSS"], "Describe steps to build an image"),
    ],
    "Flask": [
        ("What is Flask?", ["A Python web framework", "A Java compiler", "A CSS preprocessor", "A database engine"], "A Python web framework"),
        ("Which decorator commonly defines a Flask route?", ["@app.route", "@app.model", "@app.table", "@app.query"], "@app.route"),
        ("Which object provides access to incoming request data?", ["request", "responseOnly", "template", "migrate"], "request"),
        ("Which function commonly renders a Jinja template?", ["render_template()", "render_model()", "make_table()", "load_css()"], "render_template()"),
        ("Which built-in development server command is commonly used in Flask CLI?", ["flask run", "flask compile", "python manage.py runserver", "npm flask start"], "flask run"),
    ],
    "Express.js": [
        ("What is Express.js?", ["A web framework for Node.js", "A Python ORM", "A database server", "A CSS library"], "A web framework for Node.js"),
        ("Which method registers a GET route?", ["app.get()", "app.fetchOnly()", "app.select()", "app.readFile()"], "app.get()"),
        ("What does next() commonly do in Express middleware?", ["Pass control to the next middleware or handler", "Restart the server", "Create a database", "Compile JavaScript"], "Pass control to the next middleware or handler"),
        ("Which middleware parses incoming JSON request bodies?", ["express.json()", "express.static()", "express.routerOnly()", "express.compile()"], "express.json()"),
        ("Which response method sends a JSON response?", ["res.json()", "res.htmlOnly()", "res.sql()", "res.route()"], "res.json()"),
    ],
}

ALIASES = {
    "js": "JavaScript",
    "node": "Node.js",
    "nodejs": "Node.js",
    "ml": "Machine Learning",
    "ai": "Artificial Intelligence",
    "dl": "Deep Learning",
    "rest": "REST API",
    "os": "Operating Systems",
    "networking": "Computer Networks",
    "cyber security": "Cybersecurity",
    "express": "Express.js",
    "c plus plus": "C++",
}


def normalize_skill(skill):
    cleaned = skill.strip()
    return ALIASES.get(cleaned.lower(), cleaned)


def generate_quiz(user_skills, count=10, previous_skills=None):
    """
    Returns exactly `count` unique MCQs when the selected skills have enough
    unique questions. `user_skills` must be the current user's skill list.

    `previous_skills` can be a list of skill names used in the last quiz; those
    skills are deprioritized when there are more than `count` available skills.
    """
    if not isinstance(user_skills, (list, tuple, set)):
        return {"success": False, "message": "user_skills must be a list."}

    if count != 10:
        count = 10

    skills = list(dict.fromkeys(
        normalize_skill(s)
        for s in user_skills
        if isinstance(s, str) and normalize_skill(s) in QUESTION_BANK
    ))

    if not skills:
        return {
            "success": False,
            "message": "No supported skills found in the user's profile.",
        }

    previous = {normalize_skill(s) for s in (previous_skills or []) if isinstance(s, str)}
    random.shuffle(skills)

    # When there are more than 10 skills, prefer skills not used last time.
    fresh_skills = [s for s in skills if s not in previous]
    old_skills = [s for s in skills if s in previous]
    skill_order = fresh_skills + old_skills
    random.shuffle(fresh_skills)
    random.shuffle(old_skills)
    skill_order = fresh_skills + old_skills

    # Start with at most one question per selected skill.
    selected = []
    used_question_keys = set()
    for skill in skill_order:
        if len(selected) >= count:
            break
        candidates = QUESTION_BANK[skill][:]
        random.shuffle(candidates)
        for item in candidates:
            key = (skill, item[0])
            if key not in used_question_keys:
                selected.append((skill, item))
                used_question_keys.add(key)
                break

    # Fill remaining slots from all unused questions in the user's skill bank.
    remaining = [
        (skill, item)
        for skill in skills
        for item in QUESTION_BANK[skill]
        if (skill, item[0]) not in used_question_keys
    ]
    random.shuffle(remaining)
    selected.extend(remaining[:count - len(selected)])

    # Guarantee exactly 10 questions even when a profile has very few skills.
    # Reuse is only a fallback when the selected skills do not contain 10
    # distinct questions. Expanding each skill bank avoids this fallback.
    all_available = [
        (skill, item)
        for skill in skills
        for item in QUESTION_BANK[skill]
    ]
    while len(selected) < count and all_available:
        selected.append(random.choice(all_available))

    random.shuffle(selected)
    questions = []
    answer_key = {}

    for index, (skill, item) in enumerate(selected, start=1):
        question_text, original_options, correct_answer = item
        options = original_options[:]
        random.shuffle(options)

        questions.append({
            "id": index,
            "skill": skill,
            "question": question_text,
            "options": options,
        })
        answer_key[str(index)] = correct_answer

    return {
        "success": True,
        "count": len(questions),
        "questions": questions,
        "answer_key": answer_key,  # Keep this server-side; do not return to React.
        "skills_covered": list(dict.fromkeys(q["skill"] for q in questions)),
    }
