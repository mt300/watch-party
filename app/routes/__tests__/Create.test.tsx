import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Create from "../create"; // ajuste se o caminho for diferente
import { setDoc, doc } from "firebase/firestore";

// 🔧 Mocks do Firebase
vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    onSnapshot: vi.fn(),
}));

vi.mock("uuid", () => ({
  v4: () => "mocked-session-id",
}));

// 🔧 Mock do navigate
vi.mock("react-router-dom", async (original) => {
  const mod = await original;
  return {
    ...mod,
    useNavigate: () => vi.fn(),
  };
});

describe("Create session screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a session when user inputs session name and YouTube URL", async () => {
    render(
      <MemoryRouter>
        <Create />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Add a session name");
    const urlInput = screen.getByPlaceholderText(
      "Add a youtube URL to watch with your friends"
    );
    const addButton = screen.getByRole("button");

    fireEvent.change(nameInput, { target: { value: "My Cool Party" } });
    fireEvent.change(urlInput, {
      target: { value: "https://www.youtube.com/watch?v=abc123" },
    });

    fireEvent.click(addButton);

    await screen.findByText("Watch Party"); // Espera até a tela responder

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(), // o doc()
      expect.objectContaining({
        id: "mocked-session-id",
        url: "https://www.youtube.com/watch?v=abc123",
        name: "My Cool Party",
        timestamp: 0,
        playing: false,
      })
    );
  });
});
