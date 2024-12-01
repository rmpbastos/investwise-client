const calculateIndicators = (historicalData) => {
    if (historicalData.length < 14) {
      throw new Error('Insufficient historical data for indicator calculation.');
    }
  
    const closes = historicalData.map((d) => d.close);
  
    // RSI Calculation
    const RSI_PERIOD = 14;
    const deltas = closes.slice(1).map((c, i) => c - closes[i]);
    const gains = deltas.map((d) => (d > 0 ? d : 0));
    const losses = deltas.map((d) => (d < 0 ? -d : 0));
    const avgGain = gains.slice(0, RSI_PERIOD).reduce((a, b) => a + b, 0) / RSI_PERIOD;
    const avgLoss = losses.slice(0, RSI_PERIOD).reduce((a, b) => a + b, 0) / RSI_PERIOD;
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
  
    // MACD Calculation
    const MACD_FAST = 12;
    const MACD_SLOW = 26;
    const MACD_SIGNAL = 9;
    const fastEMA = closes
      .slice(-MACD_FAST)
      .reduce((a, b) => a + b, 0) / MACD_FAST;
    const slowEMA = closes
      .slice(-MACD_SLOW)
      .reduce((a, b) => a + b, 0) / MACD_SLOW;
    const macd = fastEMA - slowEMA;
    const signalLine = closes
      .slice(-MACD_SIGNAL)
      .reduce((a, b) => a + b, 0) / MACD_SIGNAL;
    const macdHistogram = macd - signalLine;
  
    // Bollinger Bands
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const stddev = Math.sqrt(closes.reduce((a, b) => a + (b - mean) ** 2, 0) / closes.length);
    const upperBand = mean + 2 * stddev;
    const lowerBand = mean - 2 * stddev;
    const bandWidth = upperBand - lowerBand;
  
    // ATR
    const highs = historicalData.map((d) => d.high);
    const lows = historicalData.map((d) => d.low);
    const atr = highs
      .map((high, i) => Math.max(high - lows[i], Math.abs(high - closes[i]), Math.abs(lows[i] - closes[i])))
      .slice(-RSI_PERIOD)
      .reduce((a, b) => a + b, 0) / RSI_PERIOD;
  
    return { rsi, macd, signalLine, macdHistogram, upperBand, lowerBand, bandWidth, atr };
  };
  
  module.exports = { calculateIndicators };
  