function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumCredits = totalVolumCredits(result);
    return result;

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

exports.createStatementData = createStatementData;