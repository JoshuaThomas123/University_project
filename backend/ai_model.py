from transformers import pipeline

class AISummarizer:
    def __init__(self, model_name="facebook/bart-large-cnn"):
        """
        Initialize the summarization pipeline with a pre-trained model.
        """
        self.summarizer = pipeline("summarization", model=model_name)

    def summarize(self, text, max_length=150, min_length=30):
        """
        Generate a summary for the given text.
        Args:
            text (str): The input text to summarize.
            max_length (int): Maximum length of the summary.
            min_length (int): Minimum length of the summary.
        Returns:
            str: The summarized text.
        """
        try:
            
            if not text.strip():
                return "Input text is empty or contains only whitespace."

            MAX_TOKENS = 1024
            tokenized_text = text.split()  
            if len(tokenized_text) > MAX_TOKENS:
                text = " ".join(tokenized_text[:MAX_TOKENS])  

        
            summary = self.summarizer(
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )

           
            return summary[0]["summary_text"]

        except Exception as e:
           
            print(f"Error during summarization: {str(e)}")
            return "An error occurred while generating the summary. Please try again."