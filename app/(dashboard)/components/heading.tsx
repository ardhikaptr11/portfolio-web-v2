export const Heading = ({ title, description }: { title: string, description: string } ) => {
  return (
    <div className="space-y-1">
      <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
      <p className='text-muted-foreground text-sm'>{description}</p>
    </div>
  );
};