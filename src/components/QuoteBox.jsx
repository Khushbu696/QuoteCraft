import { useState, useEffect } from "react";
import { FaCopy, FaShareAlt, FaSync } from "react-icons/fa";

export default function QuoteBox() {
    const [quote, setQuote] = useState({ text: "", author: "" });
    const [loading, setLoading] = useState(true);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
                headers: {
                    "X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.length > 0) {
                const quoteData = data[0];
                setQuote({
                    text: quoteData.quote,
                    author: quoteData.author || "Unknown",
                });
            } else {
                throw new Error("No quote found.");
            }
        } catch (error) {
            console.error("Failed to fetch quote:", error);
            setQuote({
                text: "Failed to load quote. Please try again.",
                author: "System",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
        alert("Quote copied to clipboard!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Inspirational Quote",
                    text: `"${quote.text}" — ${quote.author}`,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            alert("Web Share is not supported in your browser.");
        }
    };

    return (
        <div className="quote-box">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p className="quote-text">“{quote.text}”</p>
                    <p className="quote-author">— {quote.author}</p>
                </>
            )}
            <div className="buttons">
                <button onClick={fetchQuote}><FaSync /> New</button>
                <button onClick={handleCopy}><FaCopy /> Copy</button>
                <button onClick={handleShare}><FaShareAlt /> Share</button>
            </div>
        </div>
    );
}
