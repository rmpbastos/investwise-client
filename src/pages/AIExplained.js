import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DiagramImage from "../assets/diagrams/ai_explained_chart.png";

const AIExplained = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center justify-start flex-grow p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">AI Explained</h1>

        {/* Introductory Text */}
        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl text-center mb-6">
          InvestWise leverages advanced machine learning models to analyze data
          and provide predictions to help you make informed investment decisions.
        </p>

        {/* Detailed Description */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How Our AI Works</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At the core of InvestWise is a sophisticated machine learning engine that processes vast amounts of
            stock market data, including historical prices, trading volumes, and sentiment from financial news.
            By combining this data with state-of-the-art algorithms, our AI can identify trends and patterns that
            might otherwise go unnoticed.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The process begins with data collection, where our system gathers real-time market data and financial news. 
            This raw data is then refined through feature extraction, where key metrics and indicators are identified. 
            Using these refined features, our AI trains on historical trends and outcomes to develop predictive models.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Once trained, the AI provides predictions about future stock movements and identifies actionable insights
            for your portfolio. With each prediction, the AI adapts and improves, learning from new market data to ensure
            that its recommendations remain accurate and relevant.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By using InvestWise, you are equipped with powerful AI-driven insights to navigate the complexities of the
            financial markets with confidence and make data-backed investment decisions.
          </p>
        </div>

        {/* AI Process Diagram */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-center mb-4">Visualizing Our AI Process</h3>
          <img
            src={DiagramImage}
            alt="AI Process Diagram"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIExplained;