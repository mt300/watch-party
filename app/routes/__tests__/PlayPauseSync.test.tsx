// Simulates two clients triggering play/pause and sync

import { describe, it, vi, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import WatchPage from '../watch.$id';
import { FirebaseProvider } from '../../FirebaseContext';

describe('Play/Pause Sync', () => {
  it('pauses and plays video, syncing with context', async () => {
    const updateMock = vi.fn();
    const mockContext = {
      sessionId: 'test-session',
      currentTime: 0,
      isPlaying: false,
      updatePlaybackState: updateMock,
    };

    const { getByTestId } = render(
      <FirebaseProvider value={mockContext as any}>
        <VideoPlayer />
      </FirebaseProvider>
    );

    fireEvent.click(getByTestId('play-button'));
    expect(updateMock).toHaveBeenCalledWith({ isPlaying: true });

    fireEvent.click(getByTestId('pause-button'));
    expect(updateMock).toHaveBeenCalledWith({ isPlaying: false });
  });
});
