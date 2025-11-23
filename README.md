# MediBuddy v2 - AI Multi-Agent Medication Adherence Assistant

![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**⚠️ DISCLAIMER: This is an educational demonstration project. NOT a medical device. Always consult healthcare professionals for medical advice.**

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    OrchestratorAgent                        │
│              (Coordinates all sub-agents)                   │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├──► ReminderAgent     (Schedule medication reminders)
       ├──► InteractionAgent  (Check drug interactions)
       ├──► MonitorAgent      (Triage symptoms)
       ├──► NotifierAgent     (Alert caregivers)
       └──► AnalyticsAgent    (Generate adherence metrics)
              │
              ├──► MedicationDB (Interaction database)
              ├──► Scheduler    (In-memory job scheduler)
              └──► MemoryBank   (Persistent storage)
\`\`\`

## 🚀 Quick Start

### Local Development

\`\`\`bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Run tests
pytest tests/ -v

# 3. Start backend server
uvicorn backend.main:app --reload --port 8000

# 4. Open frontend
open http://localhost:8000

# 5. Start dashboard (in another terminal)
streamlit run dashboard/streamlit_app.py
\`\`\`

Or use the provided script:

\`\`\`bash
chmod +x run_all.sh
./run_all.sh
\`\`\`

### Docker

\`\`\`bash
# Build and run
cd docker
docker-compose up --build

# Backend: http://localhost:8000
# Dashboard: http://localhost:8501
\`\`\`

## 📋 Features

### Multi-Agent System
- **OrchestratorAgent**: Coordinates all agents and workflows
- **ReminderAgent**: Schedules medication reminders
- **InteractionAgent**: Detects dangerous drug interactions
- **MonitorAgent**: Triages symptoms by severity
- **NotifierAgent**: Alerts caregivers for high-risk events
- **AnalyticsAgent**: Computes adherence metrics

### API Endpoints

\`\`\`
POST /api/patient              - Create/update patient
GET  /api/patient/{id}         - Get patient details
GET  /api/patients             - List all patients
POST /api/run/{id}             - Run orchestration
GET  /api/summary/{id}         - Get clinician summary
GET  /api/events/{id}          - Get patient events
\`\`\`

### Frontend
- Simple HTML/JS patient portal
- Create patients, run orchestration, view summaries

### Dashboard
- Streamlit-based clinician dashboard
- Real-time adherence metrics
- Event history and alerts

## 🧪 Testing

\`\`\`bash
# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_interaction.py -v

# Run automated evaluation
python evaluation/automated_evaluator.py
\`\`\`

## 📊 Evaluation

The automated evaluator scores the system on:
- Patient management (10 pts)
- Interaction detection (25 pts)
- Reminder scheduling (15 pts)
- Symptom triage (20 pts)
- Analytics generation (30 pts)

**Passing score: 70/100**

See [evaluation/rubric.md](evaluation/rubric.md) for details.

## 🛠️ Technology Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn
- **Frontend**: HTML, Vanilla JavaScript
- **Dashboard**: Streamlit
- **Storage**: File-based JSON (MemoryBank)
- **Testing**: pytest
- **Deployment**: Docker, docker-compose

## 📁 Project Structure

\`\`\`
medi_buddy_v2/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt
│   ├── agents/              # Multi-agent system
│   │   ├── orchestrator.py
│   │   ├── reminder_agent.py
│   │   ├── interaction_agent.py
│   │   ├── monitor_agent.py
│   │   ├── notifier_agent.py
│   │   ├── analytics_agent.py
│   │   └── schemas.py
│   └── tools/               # Utilities
│       ├── med_db.py
│       ├── scheduler.py
│       ├── persistence.py
│       └── logger.py
├── frontend/
│   └── index.html           # Patient portal
├── dashboard/
│   └── streamlit_app.py     # Clinician dashboard
├── tests/
│   ├── test_interaction.py
│   └── test_full_flow.py
├── evaluation/
│   ├── automated_evaluator.py
│   └── rubric.md
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── run_all.sh               # Dev runner script
└── README.md
\`\`\`

## 🔒 Security & Ethics

- **No PHI/PII**: Only demo data with fake patient IDs
- **Disclaimer**: Clearly marked as educational/demo only
- **Escalation**: High-severity symptoms trigger caregiver alerts
- **No Real APIs**: Stub implementations for all external services
- **Secrets**: No API keys or credentials in code

## 📝 License

MIT License - see LICENSE file

## 🤝 Contributing

This is an educational capstone project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Run tests and evaluation
4. Submit a pull request

## 📞 Support

For issues or questions:
- Review the evaluation rubric
- Check the automated evaluator output
- Ensure all tests pass

---

**Built with ❤️ for healthcare technology education**
