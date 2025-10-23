import React, { useState } from 'react';
import Router from 'next/router';

const ADMIN_TOKEN_KEY = 'kb_admin_token';

export default function NewEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [location, setLocation] = useState('');

  const submit = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
    if (!token) return alert('You must set the admin token first (go to /admin).');

    const payload = {
      title,
      description,
      startAt,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      location,
    };

    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    const res = await fetch(`${base}/api/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Event created');
      Router.push('/');
    } else {
      const err = await res.json().catch(() => null);
      alert('Error: ' + (err?.error || res.statusText));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 style={{ color: 'var(--kb-purple)' }} className="text-2xl font-bold">Create Event</h1>
      <div className="mt-4 space-y-3">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" />
        <input type="datetime-local" placeholder="Start at" value={startAt} onChange={e => setStartAt(e.target.value)} className="w-full border p-2 rounded" />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full border p-2 rounded" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="lat" value={lat} onChange={e => setLat(e.target.value)} className="border p-2 rounded" />
          <input placeholder="lng" value={lng} onChange={e => setLng(e.target.value)} className="border p-2 rounded" />
        </div>
        <button className="btn-primary" onClick={submit}>Create</button>
      </div>
    </div>
  );
}
