import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageHeader, EmptyState } from './PageHeader';

describe('PageHeader', () => {
  it('renders title and description', () => {
    render(<PageHeader title="Produtos" description="Os teus produtos" />);
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Os teus produtos')).toBeInTheDocument();
  });

  it('does not render an action button when none is provided', () => {
    render(<PageHeader title="Produtos" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction when the action button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<PageHeader title="Produtos" actionLabel="Novo produto" onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: /novo produto/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState icon={<span data-testid="icon" />} title="Sem produtos" description="Adiciona o primeiro." />);
    expect(screen.getByText('Sem produtos')).toBeInTheDocument();
    expect(screen.getByText('Adiciona o primeiro.')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
