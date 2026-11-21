const steps = ['Мастер', 'Услуга', 'Дата и время', 'Контакты', 'Подтверждение'];

export default function BookingSteps() {
  return (
    <nav className="progress" aria-label="Шаги записи">
      <ol className="progress__list">
        {steps.map((step, index) => (
          <li key={step} className="progress__step" aria-current={index === 2 ? 'step' : undefined}>
            <span className="progress__number">{index + 1}</span> {step}
          </li>
        ))}
      </ol>
    </nav>
  );
}
