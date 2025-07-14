type TitleProps = {
  title: string
}

export const Title = ({ title }: TitleProps) => {
  return <h2 className="font-bold text-xl">{title}</h2>
}
