// 拆分计算阶段与格式阶段
function statement (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumCredits = totalVolumCredits(statementData);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    // 内联
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    // 提炼函数
    function amountFor(aPerformance) { // aPerformance跟踪变量类型
        let result = 0; // 重命名
        switch (aPerformance.play.type) {
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
                throw new Error(`Unknown type: $(aPerformance.play.type)`);
        }
        return result;
    }

    // 提炼函数
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" == aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    // 提炼函数
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0); // 管道取代循环
    }

    // 提炼函数
    function totalVolumCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0); // 管道取代循环
    }
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {

        // print line for this order
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`; // 内联变量
    result += `You earned ${data.totalVolumCredits} credits\n`; // 内联变量
    return result;

    // 函数变量改成函数声明
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {style:"currency", currency:"USD",
            minimumIntegerDigits: 2}).format(aNumber / 100);
    }
}

plays = {"hamlet": {"name": "Hamlet", "type": "tragedy"},
         "as-like": {"name": "As You Like It", "type": "comedy"},
         "othello": {"name": "Othello", "type": "tragedy"}};
invoices = {"customer": "BigCo",
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
