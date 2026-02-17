# JavaScript Concepts

## 1. accurate difference between null and undefined?

**Answer:**
Think of `undefined` as a variable that has been declared but hasn't been given a value yet—it's like an empty box labeled "storage" but with nothing inside. On the other hand, `null` is an intentional assignment of "nothing." It's like putting a label on that box that explicitly says "This box is empty on purpose." So, `undefined` is the default state of uninitialized variables, while `null` is something you manually assign to represent no value.

## 2. What is the use of the map() function in JavaScript? How is it different from forEach()?

**Answer:**
The `map()` function is used when you want to transform an array into a _new_ array. It loops through each item, applies a function to it, and returns a fresh array with the modified items.
The key difference from `forEach()` is that `map()` returns a new array, whereas `forEach()` just executes a function for each element and returns `undefined`. Use `map()` if you need the result; use `forEach()` if you just need to run a side effect (like logging or saving to a database) without creating a new list.

## 3. What is the difference between == and ===?

**Answer:**
`==` (loose equality) checks if two values are equal _after_ converting them to a common type. For example, `5 == "5"` is true because JavaScript converts the string "5" to a number before comparing.
`===` (strict equality) checks if two values are equal _without_ type conversion. So, `5 === "5"` is false because one is a number and the other is a string. Always use `===` to avoid unexpected bugs!

## 4. What is the significance of async/await in fetching API data?

**Answer:**
Fetching data from an API takes time, and JavaScript doesn't want to freeze your whole app while waiting. Before `async/await`, we used `.then()` chains (Promses), which could get messy and hard to read (callback hell).
`async/await` makes asynchronous code look and behave like synchronous (normal) code. It pauses the function execution at the `await` keyword until the data is ready, making your code cleaner, easier to read, and much simpler to debug using try/catch blocks.

## 5. Explain the concept of Scope in JavaScript (Global, Function, Block).

**Answer:**
Scope determines where variables are accessible in your code.

- **Global Scope:** Variables declared outside any function or block. They can be accessed from anywhere in your code.
- **Function Scope:** Variables declared inside a function (using `var`, `let`, or `const`). They are only accessible within that specific function.
- **Block Scope:** Variables declared inside a block `{}` (like an `if` statement or `for` loop) using `let` or `const`. They exist only within those curly braces and cannot be accessed from outside.
