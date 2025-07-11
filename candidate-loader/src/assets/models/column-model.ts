export interface Column {
  def: string;            // column definition key
  header: string;         // header text
  cell: (candidate: any) => string;  // function returning cell content as string
}