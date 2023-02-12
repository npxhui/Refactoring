// 内联
function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

// 提炼函数
function amountFor(aPerformance) { // aPerformance跟踪变量类型
    let result = 0; // 重命名
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`Unknown type: $(playFor(aPerformance).type)`);
    }
    return result;
}

// 提炼函数
function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
}

// 函数变量改成函数声明
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style:"currency", currency:"USD",
        minimumIntegerDigits: 2}).format(aNumber / 100);
}

// 提炼函数
function totalVolumCredits()
{
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
}

function statement (invoice, plays) {
    let totalAmount = 0;
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {

        // print line for this order
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${usd(totalAmount)}\n`;
    result += `You earned ${totalVolumCredits()} credits\n`; // 内联变量
    return result;
}

plays = {"hamlet": {"name": "Hamlet", "type": "tragedy"},
         "as-like": {"name": "As You Like It", "type": "comedy"},
         "othello": {"name": "Othello", "type": "tragedy"}};
invoice = {"customer": "BigCo",
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
console.log(statement(invoice, plays));
