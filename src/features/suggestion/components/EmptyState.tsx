import { Card, Button } from '@/components/ui';

interface EmptyStateProps {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function EmptyState({ message, onRetry, onBack }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-xl p-8 text-center space-y-4">
      <div className="text-5xl" role="img" aria-label="Sem resultados">
        🎬
      </div>
      <h3 className="text-lg font-semibold text-white">Nenhum resultado</h3>
      <p className="text-gray-400 text-sm">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
        {onBack && (
          <Button variant="secondary" size="sm" onClick={onBack}>
            Voltar aos filtros
          </Button>
        )}
      </div>
    </Card>
  );
}
