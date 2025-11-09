import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend,
    FieldSeparator, FieldSet,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:8080";

type FormState = {
    nome: string;
    dia: string;
    mes: string;
    ano: string;
    prioridade: string;
    descricao: string;
    urlDaImagem: string; 
};

export default function Ocorrencia() {
    const [form, setForm] = useState<FormState>({
        nome: "",
        dia: "",
        mes: "",
        ano: "",
        prioridade: "",
        descricao: "",
        urlDaImagem: "", 
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome: form.nome.trim(),
            dia: Number(form.dia) || 0,
            mes: Number(form.mes) || 0,
            ano: Number(form.ano) || 0,
            prioridade: form.prioridade,
            descricao: form.descricao.trim(),
            urlDaImagem: form.urlDaImagem, 
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string; 
            setForm(f => ({ ...f, urlDaImagem: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
            <form className="w-full max-w-md" onSubmit={onSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Cadastro de Ocorrência</FieldLegend>
                        <FieldDescription>É necessário preencher todos os campos.</FieldDescription>

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nome">Nome do responsável</FieldLabel>
                                <Input
                                    id="nome"
                                    placeholder="Evil Rabbit"
                                    required
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                />
                            </Field>

                            <div className="grid grid-cols-3 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="dia">Dia</FieldLabel>
                                    <Input
                                        id="dia"
                                        type="number"
                                        placeholder="23"
                                        required
                                        value={form.dia}
                                        onChange={(e) => setForm({ ...form, dia: e.target.value })}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="mes">Mês</FieldLabel>
                                    <Select
                                        value={form.mes}
                                        onValueChange={(v) => setForm({ ...form, mes: v })}
                                    >
                                        <SelectTrigger id="mes"><SelectValue placeholder="MM" /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-lg">
                                            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                                <SelectItem key={m} value={m} className="cursor-pointer data-[highlighted]:bg-zinc-800">
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="ano">Ano</FieldLabel>
                                    <Select
                                        value={form.ano}
                                        onValueChange={(v) => setForm({ ...form, ano: v })}
                                    >
                                        <SelectTrigger id="ano" className="cursor-pointer bg-zinc-800">
                                            <SelectValue placeholder="YYYY" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-lg">
                                            {["2024", "2025", "2026", "2027", "2028", "2029"].map(y => (
                                                <SelectItem key={y} value={y} className="cursor-pointer data-[highlighted]:bg-zinc-800">
                                                    {y}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="ano">Prioridade</FieldLabel>
                            <Select
                                value={form.prioridade}
                                onValueChange={(v) => setForm({ ...form, prioridade: v })}
                            >
                                <SelectTrigger id="ano" className="cursor-pointer bg-zinc-800">
                                    <SelectValue placeholder="Prioridade" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-lg">
                                    {["Baixa", "Media", "Alta", "Urgente"].map(y => (
                                        <SelectItem key={y} value={y} className="cursor-pointer data-[highlighted]:bg-zinc-800">
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="comments">Comentários</FieldLabel>
                                <Textarea
                                    id="comments"
                                    placeholder="Adicione o que acha pertinente para sua ocorrência!"
                                    className="resize-none"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                />
                            </Field>

                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="picture">Suba as fotos</Label>
                                <Input id="picture" type="file" accept="image/*" onChange={handleFile} />
                                {form.urlDaImagem && (
                                    <img
                                        src={form.urlDaImagem}
                                        alt="preview"
                                        className="mt-2 max-h-48 rounded border border-zinc-700"
                                    />
                                )}
                            </div>
                            <FieldDescription>Essas fotos são importantes para validar a ocorrência.</FieldDescription>
                        </FieldGroup>
                    </FieldSet>

                    <Field orientation="horizontal" className="mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Enviando..." : "Submit"}
                        </Button>
                        <Button variant="outline" type="button">Cancel</Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
