const http = require("http");

const { PORT } = process.env;

const server = http.createServer((req, res) => {
  res.statusCode = 200; // the response's status code
  res.statusMessage = "OK"; // the content of the message
  res.setHeader("Content-Type", "text/plain"); // add a header to the response
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf8",
  });

  res.write("Hello, "); // send the first part of the message - the "Hello, " string
  res.write("world!"); // send the second part of the message - the "world!" string

  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  req.on("end", () => {
    console.log(JSON.parse(data));
  });
});

res.end("<h1>Hello, World!</h1>", "utf8"); // end the response

if (process.env.NODE_ENV !== "production") {
  console.log("Code executed in development mode");
}

server.listen(PORT);
