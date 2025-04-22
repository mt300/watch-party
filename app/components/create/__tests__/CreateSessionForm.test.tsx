// app/components/__tests__/CreateSessionForm.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateSessionForm } from "../CreateSessionForm";
import { vi } from "vitest";

// Mocks externos
vi.mock("firebase/firestore", () => ({
    setDoc: vi.fn(),
    doc: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(() => ({})), // <- ESSENCIAL
    setDoc: vi.fn(),
    doc: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(), // mock do hook
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("CreateSessionForm", () => {
  it("permite digitar e submeter o formulário", () => {
    render(<CreateSessionForm />);
    const input = screen.getByPlaceholderText("Digite o nome da sessão");
    fireEvent.change(input, { target: { value: "Nova sessão" } });
    fireEvent.submit(input.closest("form")!);
    expect(input).toHaveValue("Nova sessão");
  });
});
