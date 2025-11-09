//------

"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const API_BASE = "http://localhost:8080";
const pad = (n: number) => String(n).padStart(2, "0");

type ApiOcorrencia = {
    id: string | number;
    nome: string;
    dia: number;
    mes: number;
    ano: number;
    prioridade: string;
    descricao?: string;
    urlDaImagem?: string;
};

type Row = {
    id: string;
    prioridade: string;
    nome: string;
    data: string;
    descricao?: string;
    urlDaImagem?: string;
};

export default function Consultar() {
    const [rows, setRows] = React.useState<Row[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Row | null>(null);

    React.useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/usuarios`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: ApiOcorrencia[] = await res.json();
                const mapped: Row[] = data.map((o) => ({
                    id: String(o.id),
                    prioridade: o.prioridade ?? "não informado",
                    nome: o.nome,
                    data: `${pad(o.dia)}/${pad(o.mes)}/${o.ano}`,
                    descricao: o.descricao,
                    urlDaImagem: o.urlDaImagem,
                }));
                setRows(mapped);
            } catch (e) {
                console.error(e);
                setRows([]);
            }
        };
        load();
    }, []);

    const [deleting, setDeleting] = React.useState(false);

    async function handleDeleteSelected() {
        const ids = table.getSelectedRowModel().rows.map(r => r.original.id);
        if (ids.length === 0) return;

        const ok = window.confirm(`Excluir ${ids.length} registro(s)?`);
        if (!ok) return;

        setDeleting(true);
        try {
            await Promise.all(
                ids.map(id =>
                    fetch(`${API_BASE}/usuarios/${id}`, { method: "DELETE" })
                )
            );
            // otimista: remove do estado local
            setRows(prev => prev.filter(r => !ids.includes(r.id)));
            table.resetRowSelection();
        } catch (e) {
            console.error(e);
            alert("Falha ao excluir.");
        } finally {
            setDeleting(false);
        }
    }


    const columns = React.useMemo<ColumnDef<Row>[]>(() => [
        {
            id: "select",
            header: ({ table }) => {
                const checked: boolean | "indeterminate" =
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false;
                return (
                    <div className="w-10 text-center">
                        <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                            aria-label="Select all"
                            className="mx-auto h-8 w-8 [&_svg]:translate-y-[1px]"
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="w-10 text-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                        className="mx-auto h-8 w-8 [&_svg]:translate-y-[1px]"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Imagem",
            header: () => <div className="text-center">Imagem</div>,
            cell: ({ row }) => {
                const u = row.original.urlDaImagem;
                return u ? (
                    <img
                        src={u}
                        alt="thumb"
                        loading="lazy"
                        className="mx-auto h-10 w-10 rounded object-cover border border-zinc-700"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : null;
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "prioridade",
            header: () => <div className="text-center">Prioridade</div>,
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue("prioridade") as string}</div>,
        },
        {
            accessorKey: "nome",
            header: ({ column }) => (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-2 gap-1"
                    >
                        Nome do responsável
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue("nome") as string}</div>,
        },
        {
            accessorKey: "data",
            header: () => <div className="text-right">Data</div>,
            cell: ({ row }) => <div className="text-right font-medium">{row.getValue("data") as string}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const r = row.original;
                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-lg">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setSelected(r);
                                    setOpen(true);
                                }}
                                className="cursor-pointer data-[highlighted]:bg-zinc-800"
                            >
                                Olhar Ocorrência
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    const table = useReactTable({
        data: rows,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <div className="w-full">
            {/* Dialog global */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[42rem] bg-zinc-900 text-zinc-100 border border-zinc-700">
                    <DialogHeader>
                        <DialogTitle>Detalhes da ocorrência</DialogTitle>
                        <DialogDescription className="sr-only">Informações da ocorrência selecionada</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-muted-foreground">Responsável</div>
                            <div className="col-span-2">{selected?.nome ?? "Não informado"}</div>

                            <div className="text-muted-foreground">Data</div>
                            <div className="col-span-2">{selected?.data ?? "Não informado"}</div>

                            <div className="text-muted-foreground">Prioridade</div>
                            <div className="col-span-2">{selected?.prioridade ?? "Não informado"}</div>

                            <div className="text-muted-foreground">Descrição</div>
                            <div className="col-span-2 whitespace-pre-wrap">
                                {selected?.descricao ?? "-"}
                            </div>

                            <div className="text-muted-foreground">Imagem</div>
                            <div className="col-span-2">
                                {selected?.urlDaImagem ? (
                                    <img
                                        src={selected.urlDaImagem}
                                        alt="anexo"
                                        loading="lazy"
                                        className="max-h-[20rem] rounded border border-zinc-700 object-contain"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            const a = document.createElement("a");
                                            a.href = selected.urlDaImagem!;
                                            a.textContent = "Abrir imagem";
                                            a.target = "_blank";
                                            a.rel = "noreferrer";
                                            a.className = "underline";
                                            e.currentTarget.replaceWith(a);
                                        }}
                                    />
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
                        <Button onClick={() => setOpen(false)}>Ok</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar por nome..."
                    value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("nome")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="align-end">
                    <Button variant="outline" className="ml-auto cursor-pointer" onClick={handleDeleteSelected} disabled={deleting || table.getSelectedRowModel().rows.length===0}> 
                        {deleting?"Deletando..." :"Clique para deletar!"}
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer bg-zinc-800">
                        <Button variant="outline" className="ml-auto cursor-pointer data-[highlighted]:bg-zinc-800">
                            Colunas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((c) => c.getCanHide())
                            .map((c) => (
                                <DropdownMenuCheckboxItem
                                    key={c.id}
                                    className="capitalize"
                                    checked={c.getIsVisible()}
                                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                                >
                                    {c.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id}>
                                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((r) => (
                                <TableRow key={r.id} data-state={r.getIsSelected() && "selected"}>
                                    {r.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Sem resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} selecionada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
