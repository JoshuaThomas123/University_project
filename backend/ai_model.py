from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

class AISummarizer:
    def __init__(self, model_name="google/flan-t5-large"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)
        # starts the model and token, uses either gpu(cuda) or cpu

    def summarize(self, text, max_length=500, min_length=100):
        """
        Generate a summary for the given input text.
        """ # custom prompt
        try:
            if not text.strip():
                return "Input text is empty or contains only whitespace."
            # text is tokenize
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=4096
            ).to(self.device)
            # creates the summary
            summary_ids = self.model.generate(
                inputs["input_ids"],
                max_length=max_length,
                min_length=min_length,
                num_beams=3,
                early_stopping=True
            )
            # decode
            return self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        except Exception as e:
            print(f"Error during summarization: {str(e)}")
            return "An error occurred while generating the summary."

    def generate_questions(self, text, num_questions=5):
        try:
            if not text.strip():
                return ["Input text is empty or contains only whitespace."]
            # specific prompt
            prompt = f"Generate exactly {num_questions} distinct questions, each on a new line, based on the following text:\n{text}"
            # tokenize prompt
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=4096
            ).to(self.device)
            # creates questions
            question_ids = self.model.generate(
                inputs["input_ids"],
                max_length=400,
                num_beams=5,
                num_return_sequences=num_questions,  
                early_stopping=True
            )
            # decode each question
            questions = []
            for i in range(num_questions):
                question_raw = self.tokenizer.decode(question_ids[i], skip_special_tokens=True)
                questions.append(question_raw.strip())
            # Return the questions
            return questions
        except Exception as e:
            print(f"Error during question generation: {str(e)}")
            return ["An error occurred while generating questions."]

    def generate_flashcards(self, text, num_flashcards=2):
        try:
            if not text.strip():
                return [{"question": "Input text is empty or contains only whitespace.", "answer": ""}]
            
            # creates a prompt
            prompt = f"Generate exactly {num_flashcards} flashcards as question-answer pairs, each on a new line, based on the following text:\n{text}"
            
            # tokenize prompt
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=4096
            ).to(self.device)
            
            # create flashcards
            flashcard_ids = self.model.generate(
                inputs["input_ids"],
                max_length=400,
                num_beams=5,
                num_return_sequences=num_flashcards,  
                early_stopping=True
            )
            
            # decode each flashcard
            flashcards = []
            for i in range(num_flashcards):
                flashcard_raw = self.tokenizer.decode(flashcard_ids[i], skip_special_tokens=True)
                
                # split questions and answers
                if ":" in flashcard_raw:
                    question, answer = flashcard_raw.split(":", 1)
                    flashcards.append({"question": question.strip(), "answer": answer.strip()})
                else:
                    flashcards.append({"question": flashcard_raw.strip(), "answer": "No answer generated."})
            
            # return flashcards
            return flashcards
        except Exception as e:
            print(f"Error during flashcard generation: {str(e)}")
            return [{"question": "An error occurred while generating flashcards.", "answer": ""}]

    def generate_mindmap(self, text, max_topics=5, max_subtopics=3):
        try:
            if not text.strip():
                return {"error": "Input text is empty or contains only whitespace."}
            
            # create main topic
            topic_prompt = f"Extract up to {max_topics} main topics from the following text:\n{text}"
            topic_inputs = self.tokenizer(
                topic_prompt,
                return_tensors="pt",
                truncation=True,
                max_length=4096
            ).to(self.device)
            topic_ids = self.model.generate(
                topic_inputs["input_ids"],
                max_length=400,
                num_beams=5,
                num_return_sequences=max_topics,
                early_stopping=True
            )
            topics = [self.tokenizer.decode(topic_id, skip_special_tokens=True).strip() for topic_id in topic_ids]
            
            # creates sub topics
            mindmap = {}
            for topic in topics:
                subtopic_prompt = f"Extract up to {max_subtopics} subtopics related to the following topic:\n{topic}"
                subtopic_inputs = self.tokenizer(
                    subtopic_prompt,
                    return_tensors="pt",
                    truncation=True,
                    max_length=4096
                ).to(self.device)
                subtopic_ids = self.model.generate(
                    subtopic_inputs["input_ids"],
                    max_length=400,
                    num_beams=5,
                    num_return_sequences=max_subtopics,
                    early_stopping=True
                )
                subtopics = [self.tokenizer.decode(subtopic_id, skip_special_tokens=True).strip() for subtopic_id in subtopic_ids]
                mindmap[topic] = subtopics
            
            # return mindmap
            return mindmap
        except Exception as e:
            print(f"Error during mind map generation: {str(e)}")
            return {"error": "An error occurred while generating the mind map."}
