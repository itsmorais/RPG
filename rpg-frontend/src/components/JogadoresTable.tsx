import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Jogador } from "../interfaces/jogador";

interface DataTableProps {
  jogadores: Jogador[]
  ativadorJogador?: (jogador:Jogador) => void
  tableHeight:number
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Nome",
    flex: 1,
  },
  {
    field: "class_name",
    headerName: "Classe",
    flex: 1,
  },
  {
    field: "xp",
    headerName: "XP",
    type: "number",
    flex: 0.5,
  },
  {
    field: "confirmed",
    headerName: "Status",
    flex: 0.5,
    renderCell: (params) =>
      params.value === 1 ? (
        <span className="text-green-700">Ativo</span>
      ) : (
        <span style={{ color: "red" }}>Inativo</span>
      ),
    sortComparator: (v1, v2) => v1 - v2, // Custom comparator to sort by 1 (Ativo) or 0 (Inativo)

  },
];


export default function DataTable({ jogadores,ativadorJogador,tableHeight}: DataTableProps) {
  const handleCellClick = (e: Jogador) => {
    if (ativadorJogador) {
      ativadorJogador(e)
    }
  };
  return (
    <Paper sx={{ height: tableHeight, width: "100%" }}>
      <DataGrid
      className="cursor-pointer"
        rows={jogadores}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 12 },
          },
          sorting: {
            sortModel: [{ field: 'confirmed', sort: 'asc' }]
          }
        }}
        onCellClick={(e) => handleCellClick(e.row)}
        pageSizeOptions={[12, 20, 30]}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
