import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tile from './Tile';

describe('Tile Component', () => {
    it('renders correctly', () => {
        const { container } = render(<Tile type={1} rotation={0} onClick={() => { }} />);
        const tile = container.querySelector('.tile');
        expect(tile).toBeInTheDocument();
    });

    it('rotates visuals based on rotation prop', () => {
        const { container } = render(<Tile type={1} rotation={1} onClick={() => { }} />);
        // Check if style transform is applied
        const tileDiv = container.firstChild as HTMLElement;
        expect(tileDiv.style.transform).toBe('rotate(90deg)');
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        const { container } = render(<Tile type={1} rotation={0} onClick={handleClick} />);
        const tileDiv = container.firstChild as HTMLElement;
        fireEvent.click(tileDiv);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
