// Tests joining a session using a shareable link
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WatchPage from '../../../routes/watch.$sessionId';

describe('Join session', () => {
  it('loads the session via shareable link', () => {
    render(
      <MemoryRouter initialEntries={['/watch/test-session-id']}>
        <Routes>
          <Route path="/watch/:sessionId" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('video-player')).toBeInTheDocument();
  });
});
