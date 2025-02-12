// Backend: Express.js (Node.js) + MongoDB API
// File: backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/medical-reports', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ReportSchema = new mongoose.Schema({
    patient_id: String,
    patient_name: String,
    date: String,
    examination_type: String,
    indication: String,
    findings: String,
    radiographer_name: String
});
const Report = mongoose.model('Report', ReportSchema);

app.post('/reports', async (req, res) => {
    const report = new Report(req.body);
    await report.save();
    res.json({ message: 'Report saved!' });
});

app.get('/reports', async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
});

app.listen(5000, () => console.log('Server running on port 5000'));


// Frontend: Next.js + TailwindCSS
// File: frontend/pages/index.js

import { useState } from 'react';

export default function Home() {
    const [form, setForm] = useState({ patient_id: '', patient_name: '', date: new Date().toISOString().split('T')[0], examination_type: '', indication: '', findings: '', radiographer_name: '' });
    const [report, setReport] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) setReport(form);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Medical Reporter</h1>
            <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <input type="text" name="patient_id" placeholder="Patient ID" className="w-full p-2 border" onChange={handleChange} required />
                <input type="text" name="patient_name" placeholder="Patient Name" className="w-full p-2 border mt-4" onChange={handleChange} required />
                <input type="date" name="date" className="w-full p-2 border mt-4" value={form.date} readOnly />
                <textarea name="indication" placeholder="Indication of Study" className="w-full p-2 border mt-4" onChange={handleChange} required></textarea>
                <textarea name="findings" placeholder="Findings" className="w-full p-2 border mt-4" onChange={handleChange} required></textarea>
                <input type="text" name="radiographer_name" placeholder="Radiographer Name" className="w-full p-2 border mt-4" onChange={handleChange} required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 mt-4">Generate Report</button>
            </form>
            {report && <pre className="mt-6 p-4 bg-gray-100">{JSON.stringify(report, null, 2)}</pre>}
        </div>
    );
}


// React Native (Expo) - Mobile App
// File: mobile/App.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

export default function App() {
    const [form, setForm] = useState({ patient_id: '', patient_name: '', date: new Date().toISOString().split('T')[0], examination_type: '', indication: '', findings: '', radiographer_name: '' });
    const [report, setReport] = useState(null);

    const handleChange = (key, value) => setForm({ ...form, [key]: value });
    const handleSubmit = async () => {
        const res = await fetch('http://localhost:5000/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) setReport(form);
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Medical Reporter</Text>
            <TextInput placeholder="Patient ID" onChangeText={(value) => handleChange('patient_id', value)} style={{ borderBottomWidth: 1, marginTop: 10 }} />
            <TextInput placeholder="Patient Name" onChangeText={(value) => handleChange('patient_name', value)} style={{ borderBottomWidth: 1, marginTop: 10 }} />
            <TextInput placeholder="Indication" onChangeText={(value) => handleChange('indication', value)} style={{ borderBottomWidth: 1, marginTop: 10 }} />
            <TextInput placeholder="Findings" onChangeText={(value) => handleChange('findings', value)} style={{ borderBottomWidth: 1, marginTop: 10 }} />
            <TextInput placeholder="Radiographer Name" onChangeText={(value) => handleChange('radiographer_name', value)} style={{ borderBottomWidth: 1, marginTop: 10 }} />
            <Button title="Generate Report" onPress={handleSubmit} />
            {report && <Text style={{ marginTop: 20 }}>{JSON.stringify(report, null, 2)}</Text>}
        </ScrollView>
    );
}

