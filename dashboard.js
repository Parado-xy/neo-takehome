const http = require("http");
const fs = require("fs/promises");
const { preprocessMessage } = require("./preprocessing");

const PORT = 3000;

async function gatherData(messagesPath) {
  let data = {
    total: 0,
    valid: 0,
    invalid: 0,
    triaged: [],
    evalScore: "N/A",
    evalResults: [],
  };

  try {
    // 1. Process Raw Messages
    const rawData = await fs.readFile(messagesPath, "utf-8");
    const messages = JSON.parse(rawData);
    data.total = messages.length;

    messages.forEach((msg) => {
      if (preprocessMessage(msg).valid) data.valid++;
      else data.invalid++;
    });

    // 2. Load Triage Results
    const triageData = await fs.readFile("triaged_results.json", "utf-8");
    let parsedTriage = JSON.parse(triageData);

    // Sort by Urgency (Critical > High > Medium > Low)
    const urgencyWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    parsedTriage.sort((a, b) => {
      const weightA = urgencyWeight[a.triageInfo?.urgency] || 0;
      const weightB = urgencyWeight[b.triageInfo?.urgency] || 0;
      return weightB - weightA;
    });

    data.triaged = parsedTriage;

    // 3. Load Eval Results
    const evalData = await fs.readFile("eval_report.json", "utf-8");
    const parsedEval = JSON.parse(evalData);
    data.evalScore = parsedEval.accuracy;
    data.evalResults = parsedEval.results;
  } catch (error) {
    console.error(
      "Warning: Some data files are missing. Run the pipeline and eval first.",
      error.message,
    );
  }

  return data;
}

function generateHTML(data) {
  // Helper for color coding categories
  const getCategoryColor = (category) => {
    switch (category) {
      case "Bug":
        return "bg-red-100 text-red-800";
      case "Spam":
        return "bg-gray-100 text-gray-800";
      case "Sales":
        return "bg-green-100 text-green-800";
      case "Feature Request":
        return "bg-purple-100 text-purple-800";
      case "Support":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === "Critical") return "text-red-600 font-bold";
    if (urgency === "High") return "text-orange-500 font-bold";
    return "text-gray-500";
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Triage Pipeline Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 p-8 font-sans text-gray-800">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-gray-900">AI Triage Dashboard</h1>
            
            <!-- Key Metrics -->
            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div class="text-sm text-gray-500 mb-1">Total Messages</div>
                    <div class="text-3xl font-bold">${data.total}</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div class="text-sm text-gray-500 mb-1">Valid Messages</div>
                    <div class="text-3xl font-bold text-blue-600">${data.valid}</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div class="text-sm text-gray-500 mb-1">Invalid Messages</div>
                    <div class="text-3xl font-bold text-red-600">${data.invalid}</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div class="text-sm text-gray-500 mb-1">Eval Accuracy</div>
                    <div class="text-3xl font-bold text-green-600">${data.evalScore}%</div>
                </div>
            </div>

            <!-- Evaluation Sample -->
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Evaluation Sample (Judge's Output)</h2>
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="p-4 font-medium text-gray-600">ID</th>
                            <th class="p-4 font-medium text-gray-600">Status</th>
                            <th class="p-4 font-medium text-gray-600">Reasoning</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${data.evalResults
                          .map(
                            (r) => `
                            <tr>
                                <td class="p-4 text-sm text-gray-500">${r.id || "N/A"}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded text-xs font-medium ${r.pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">
                                        ${r.pass ? "PASS" : "FAIL"}
                                    </span>
                                </td>
                                <td class="p-4 text-sm">${r.reasoning}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>

            <!-- Triage Results -->
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Recent Triage Results (Sorted by Urgency)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.triaged
                  .map(
                    (t) => `
                    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start mb-4">
                            <span class="${getCategoryColor(t.triageInfo?.category)} text-xs font-semibold px-2.5 py-0.5 rounded">${t.triageInfo?.category}</span>
                            <span class="text-xs font-medium ${getUrgencyColor(t.triageInfo?.urgency)}">Urgency: ${t.triageInfo?.urgency}</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-4 line-clamp-3">"${t.original}"</p>
                        <div class="bg-gray-50 rounded p-3 text-sm">
                            <span class="font-medium">Summary:</span> ${t.triageInfo?.summary}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    </body>
    </html>
  `;
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const messagesFile = process.argv[2] || "messages.json";
    const data = await gatherData(messagesFile);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(generateHTML(data));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`\nDashboard is running!`);
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop.`);
});
