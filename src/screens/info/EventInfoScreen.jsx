import React from 'react'
import { Card } from '../../components/common/Card'

export const EventInfoScreen = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Event Information</h1>
      
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">About the Event</h2>
        <p className="text-gray-600 mb-4">
          The Foundation for Experiential Education and Practices (FEEP) hosts this annual gathering to bring together
          facilitators, educators, and practitioners who are advancing experiential learning.
        </p>
        <a
          href="https://www.foundationeep.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-black font-semibold hover:opacity-90 transition"
        >
          Visit foundationeep.org
        </a>
      </Card>
      
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Venue</h2>
        <p className="text-gray-600 mb-2">📍 Main Auditorium</p>
        <p className="text-gray-600">Contact: info@eep.org</p>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-bold mb-4">Guidelines</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Please arrive 15 minutes early</li>
          <li>Bring your ID and event pass</li>
          <li>Respect speaker and attendee privacy</li>
          <li>No photography during keynotes</li>
        </ul>
      </Card>
    </div>
  )
}
