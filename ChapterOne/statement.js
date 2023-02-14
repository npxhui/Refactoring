const { createStatementData } = require("./createStatementData");

function statement (invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {

        // print line for this order
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`; // 内联变量
    result += `You earned ${data.totalVolumCredits} credits\n`; // 内联变量
    return result;
}

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml (data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>const</th></th></tr>";
    for (let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>`;
    result += `<p>You earned <em>${data.totalVolumCredits}</em> credits</p>\n`;
    return result;
}

// 函数变量改成函数声明
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style:"currency", currency:"USD",
        minimumIntegerDigits: 2}).format(aNumber / 100);
}

plays = {
        "hamlet": {"name": "Hamlet", "type": "tragedy"},
         "as-like": {"name": "As You Like It", "type": "comedy"},
         "othello": {"name": "Othello", "type": "tragedy"}};
invoices = {
            "customer": "BigCo",
             "performances": [{
                "playID": "hamlet",
                "audience": 55
             },
            {
                "playID": "as-like",
                "audience": 35
            },
            {
                "playID": "othello",
                "audience": 40
            }]};

console.log(statement(invoices, plays));