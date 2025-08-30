import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Material {
  id: number;
  nome: string;
  classe?: string;
  tipo?: string;
  complemento?: string;
}

interface MaterialForm {
  nome: string;
  classe: string;
  tipo: string;
  complemento: string;
}

@Component({
  selector: 'app-material-classe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-classe.component.html',
  styleUrls: ['./material-classe.component.css']
})
export class MaterialClasseComponent implements OnInit {
  materiais: Material[] = [
    { id: 1, nome: 'CIMENTO', classe: '4.1' },
    { id: 2, nome: 'Agregado Miudo', classe: '4.3' },
    { id: 3, nome: 'Agregado Graudo', classe: '4.2' },
    { id: 4, nome: 'Aditivo', classe: '4.5' },
    { id: 5, nome: 'Adição', classe: '4.6' },
    { id: 6, nome: 'Água', classe: undefined }
  ];
  materiaisFiltrados: Material[] = [];
  materiaisPaginados: Material[] = [];

  filtroNome: string = '';
  paginaAtual: number = 1;
  registrosPorPagina: number = 10;
  totalRegistros: number = 0;

  showModal: boolean = false;
  modoEdicao: boolean = false;
  materialSelecionado: Material | null = null;

  materialForm: MaterialForm = {
    nome: '',
    classe: '',
    tipo: '',
    complemento: ''
  };

  Math = Math;

  ngOnInit() {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroNome.trim()) {
      this.materiaisFiltrados = this.materiais.filter(m =>
        m.nome.toLowerCase().includes(this.filtroNome.trim().toLowerCase())
      );
    } else {
      this.materiaisFiltrados = [...this.materiais];
    }
    this.totalRegistros = this.materiaisFiltrados.length;
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  novo() {
    this.modoEdicao = false;
    this.materialForm = { nome: '', classe: '', tipo: '', complemento: '' };
    this.showModal = true;
  }

  editar(material: Material) {
    this.modoEdicao = true;
    this.materialSelecionado = material;
    this.materialForm = {
      nome: material.nome,
      classe: material.classe || '',
      tipo: material.tipo || '',
      complemento: material.complemento || ''
    };
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.materialSelecionado = null;
  }

  salvarMaterial() {
    if (this.modoEdicao && this.materialSelecionado) {
      // Atualiza material existente
      this.materialSelecionado.nome = this.materialForm.nome;
      this.materialSelecionado.classe = this.materialForm.classe;
      this.materialSelecionado.tipo = this.materialForm.tipo;
      this.materialSelecionado.complemento = this.materialForm.complemento;
    } else {
      // Adiciona novo material
      const novoMaterial: Material = {
        id: this.materiais.length + 1,
        nome: this.materialForm.nome,
        classe: this.materialForm.classe,
        tipo: this.materialForm.tipo,
        complemento: this.materialForm.complemento
      };
      this.materiais.push(novoMaterial);
    }
    this.fecharModal();
    this.aplicarFiltro();
  }

  alterarRegistrosPorPagina() {
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.registrosPorPagina;
    const fim = inicio + this.registrosPorPagina;
    this.materiaisPaginados = this.materiaisFiltrados.slice(inicio, fim);
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina() {
    if (this.paginaAtual * this.registrosPorPagina < this.totalRegistros) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }
}