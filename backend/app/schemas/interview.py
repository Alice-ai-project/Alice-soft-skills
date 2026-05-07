from pydantic import BaseModel


class InterviewStartResponse(BaseModel):
    session_id: str
    first_question: str


class InterviewAnswerRequest(BaseModel):
    session_id: str
    answer: str


class InterviewAnswerResponse(BaseModel):
    session_id: str
    next_question: str | None
    finished: bool
