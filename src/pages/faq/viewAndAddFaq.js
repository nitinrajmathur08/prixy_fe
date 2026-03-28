import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getFaq, addEdit, deleteFaq, MAIN_BASE_URL } from '../../config';
import { Button } from '@mui/material';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(getFaq);
      const items = Array.isArray(res?.data?.data) ? res.data.data : [];
      setFaqs(items.map((item) => ({ ...item, localId: item._id || item.id })));
    } catch (err) {
      console.error('FAQ fetch failed', err);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onFaqChange = (localId, field, value) => {
    setFaqs((prev) => prev.map((faq) => (faq.localId === localId ? { ...faq, [field]: value } : faq)));
  };

  const onAddRow = () => {
    const tempId = `temp-${Date.now()}`;
    setFaqs((prev) => [...prev, { question: '', answer: '', localId: tempId, __new: true }]);
  };

  const onSaveFaq = async (faq) => {
    if (!faq.question?.trim() || !faq.answer?.trim()) {
      toast.error('FAQ question and answer are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        question: faq.question,
        answer: faq.answer,
        faqId: faq._id || faq.id || undefined,
      };
      await axios.post(addEdit, payload);
      toast.success('FAQ saved');
      await fetchFaqs();
    } catch (err) {
      console.error('Save FAQ failed', err);
      toast.error('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteFaq = async (faq) => {
    if (!faq._id && !faq.id) {
      setFaqs((prev) => prev.filter((item) => item.localId !== faq.localId));
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${MAIN_BASE_URL}/api/admin/gobal-settings/delete-faq/${faq._id || faq.id}`);
      toast.success('FAQ deleted');
      await fetchFaqs();
    } catch (err) {
      console.error('Delete FAQ failed', err);
      toast.error('Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-wrapper">Loading...</div>;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">FAQ Management</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-table">
              <div className="container-fluid">
                <label className="lableClass">FAQs</label>

                {faqs.length === 0 ? <p>No FAQs found.</p> : null}

                {faqs.map((faq) => (
                  <div key={faq.localId} className="row" style={{ alignItems: 'center', marginBottom: '10px' }}>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="lableClass">Question</label>
                        <input
                          type="text"
                          className="form-control"
                          value={faq.question || ''}
                          onChange={(e) => onFaqChange(faq.localId, 'question', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="lableClass">Answer</label>
                        <input
                          type="text"
                          className="form-control"
                          value={faq.answer || ''}
                          onChange={(e) => onFaqChange(faq.localId, 'answer', e.target.value)}
                          style={{ marginTop: '5px' }}
                        />
                      </div>
                    </div>

                    <Button onClick={() => onSaveFaq(faq)} title="Save FAQ">
                      <i className="fa fa-check-circle fa-lg" style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                    </Button>
                    <Button onClick={() => onDeleteFaq(faq)} title="Delete FAQ">
                      <i className="fa fa-trash fa-lg" style={{ color: 'red', fontSize: '25px', marginTop: '10px' }}></i>
                    </Button>
                  </div>
                ))}

                <div className="row" style={{ alignItems: 'center' }}>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="lableClass">New Question</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Enter question"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="lableClass">New Answer</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        style={{ marginTop: '5px' }}
                        placeholder="Enter answer"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      if (!newQuestion.trim() || !newAnswer.trim()) {
                        toast.error('Both question and answer are required');
                        return;
                      }
                      await onSaveFaq({ question: newQuestion, answer: newAnswer });
                      setNewQuestion('');
                      setNewAnswer('');
                    }}
                    title="Save new FAQ"
                  >
                    <i className="fa fa-check-circle fa-lg" style={{ color: 'green', fontSize: '25px', marginTop: '10px' }}></i>
                  </Button>

                  <Button onClick={onAddRow} title="Add another FAQ row">
                    <i className="fa fa-plus fa-lg" style={{ color: 'blue', fontSize: '25px', marginTop: '10px' }}></i>
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;