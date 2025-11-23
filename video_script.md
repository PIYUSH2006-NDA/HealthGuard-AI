# MediBuddy v2 - 2-Minute Demo Script

## [0:00-0:15] Opening (15 seconds)

*Screen: MediBuddy v2 logo/homepage*

"Hi, I'm demonstrating MediBuddy v2, an AI multi-agent system designed to improve medication adherence. This educational project shows how coordinated AI agents can detect drug interactions, monitor symptoms, and alert caregivers."

## [0:15-0:35] Architecture Overview (20 seconds)

*Screen: Architecture diagram*

"The system uses six specialized agents: the Orchestrator coordinates everything, the Interaction Agent checks for dangerous drug combinations, the Monitor Agent triages symptoms, the Reminder Agent schedules doses, the Notifier Agent alerts caregivers, and the Analytics Agent tracks adherence."

## [0:35-0:55] Demo: Interaction Detection (20 seconds)

*Screen: Frontend - creating patient*

"Let me show you. I'm creating a patient taking both Aspirin and Warfarin. When I click 'Run Orchestration' and select 'Check Interactions'..."

*Click button*

"...the system immediately detects a dangerous interaction: increased bleeding risk. A caregiver alert is automatically triggered."

## [0:55-1:15] Demo: Symptom Triage (20 seconds)

*Screen: Symptom logging*

"Now let's log a high-severity symptom: chest pain with severity 9 out of 10."

*Enter symptom and submit*

"The Monitor Agent classifies this as critical and recommends seeking immediate medical attention. Again, the caregiver is notified automatically."

## [1:15-1:35] Demo: Dashboard (20 seconds)

*Screen: Streamlit dashboard*

"Clinicians can view everything in this dashboard: patient medications, recent events, adherence rates, and alerts. Here we see our patient has a detected interaction and a critical symptom reported."

## [1:35-1:50] Evaluation & Testing (15 seconds)

*Screen: Terminal showing test results*

"The system includes automated evaluation and unit tests. Here we see it scores 95 out of 100, passing all interaction detection, symptom triage, and analytics tests."

## [1:50-2:00] Closing (10 seconds)

*Screen: Disclaimer + GitHub*

"Remember: this is an educational demo, NOT a medical device. Always consult healthcare professionals. The code is open source under MIT license. Thank you!"

---

## Visual Elements Needed

1. MediBuddy v2 logo/title screen
2. Architecture diagram (agents)
3. Screen recording of frontend interaction
4. Screen recording of dashboard
5. Terminal showing test output
6. Disclaimer slide
7. GitHub repository link

## Key Points to Emphasize

✅ Multi-agent coordination  
✅ Real-time interaction detection  
✅ Automatic caregiver alerts  
✅ Clinical dashboard  
✅ Comprehensive testing  
⚠️ Educational demo disclaimer

## Backup Talking Points (if time allows)

- "The system uses rule-based triage for transparency"
- "All events are logged for audit trails"
- "Docker deployment included for easy setup"
- "Future enhancements include LLM integration"
\`\`\`

```text file="LICENSE"
MIT License

Copyright (c) 2024 MediBuddy v2 Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

DISCLAIMER: This software is an educational demonstration and is NOT a medical
device. It is not intended for clinical use or patient treatment. Always consult
qualified healthcare professionals for medical advice, diagnosis, or treatment.
