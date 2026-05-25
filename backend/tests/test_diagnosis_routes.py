from app.modules.diagnosis.questions import DEFAULT_QUESTIONNAIRE


def test_post_start_returns_session_and_first_question(client) -> None:
    response = client.post("/api/diagnosis/start")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"]
    assert data["questionnaire_id"] == DEFAULT_QUESTIONNAIRE.id
    assert data["first_question"]["id"] == DEFAULT_QUESTIONNAIRE.questions[0].id
    assert data["disclaimer"] == DEFAULT_QUESTIONNAIRE.disclaimer


def test_post_answer_flow_and_get_result(client) -> None:
    sid = client.post("/api/diagnosis/start").json()["session_id"]
    q = DEFAULT_QUESTIONNAIRE

    for i, question in enumerate(q.questions):
        r = client.post(
            "/api/diagnosis/answer",
            json={
                "session_id": sid,
                "question_id": question.id,
                "option_id": question.options[0].id,
            },
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["session_id"] == sid
        if i < len(q.questions) - 1:
            assert body["finished"] is False
            assert body["next_question"]["id"] == q.questions[i + 1].id
        else:
            assert body["finished"] is True
            assert body["next_question"] is None

    res = client.get(f"/api/diagnosis/result/{sid}")
    assert res.status_code == 200
    out = res.json()
    assert out["session_id"] == sid
    assert out["questionnaire_id"] == q.id
    assert len(out["dimension_scores"]) == len(q.dimensions)
    assert out["dominant_dimension_id"]
    assert out["dominant_dimension_label"]
    assert out["interpretation_placeholder"]
    assert isinstance(out["recommendations_placeholder"], list)
    assert out["disclaimer"] == q.disclaimer


def test_get_result_before_completion_returns_409(client) -> None:
    sid = client.post("/api/diagnosis/start").json()["session_id"]
    r = client.get(f"/api/diagnosis/result/{sid}")
    assert r.status_code == 409
    assert "completo" in r.json()["detail"].lower()
