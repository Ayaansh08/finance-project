interface SummaryCardProps {
  label: string;
  value: string;
  tone?: "default" | "positive" | "danger";
}

export const SummaryCard = ({ label, value, tone = "default" }: SummaryCardProps) => {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p className="summary-card__label">{label}</p>
      <p className="summary-card__value">{value}</p>
    </article>
  );
};
