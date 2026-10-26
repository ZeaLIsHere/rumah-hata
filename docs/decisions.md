# Rekam Keputusan Arsitektur (Architecture Decisions Record)

## ADR-001: Pemisahan Paket Mesin Linguistik Murni
- **Keputusan**: `packages/linguistics` adalah paket TypeScript murni tanpa ketergantungan pada React, Next.js, atau browser DOM.
- **Alasan**: Sesuai PRD §10 dan AGENT.md §3. Menjamin engine deterministik, mudah diuji secara otomatis (Vitest), dan dapat dipakai ulang di platform lain (CLI, server, atau mobile).

## ADR-002: Aturan Aksara Berbasis Data
- **Keputusan**: Seluruh aturan transliterasi dan tabel grafem disimpan dalam format JSON di `data/simalungun/aksara-rules.json`.
- **Alasan**: Memungkinkan penyesuaian aturan fonologis oleh ahli bahasa tanpa harus merefaktor kode engine.

## ADR-003: Alur Evaluasi Terjemahan Bertingkat
- **Keputusan**:
  1. Tingkat 1: Pencocokan eksak leksikon & kamus baku (`provenance: dictionary`).
  2. Tingkat 2: Analisis morfologis & dekomposisi lema (`provenance: rule`).
  3. Tingkat 3: Grounded AI fallback dengan penandaan status ketidakpastian (`provenance: ai-grounded` atau `unknown`).
- **Alasan**: Mencegah halusinasi AI pada bahasa daerah dengan sumber daya rendah (low-resource language).
