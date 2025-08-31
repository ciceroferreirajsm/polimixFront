import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';

interface Produto {
  id: number;
  material: string;
  codigoTecnico: string;
  fornecedor: string;
  fabrica: string;
  codigoProdProtheus?: string;
  materialBase?: string;
  status?: string;
  massaEspecifica?: number | null;
  massaUnitaria?: number | null;
  unidadeMedida?: string;
  co2Material?: string;
  observacao?: string;
}

interface ProdutoForm {
  material: string;
  codigoTecnico: string;
  fornecedor: string;
  fabrica: string;
  codigoProdProtheus: string;
  materialBase: string;
  status: string;
  massaEspecifica: number | null;
  massaUnitaria: number | null;
  unidadeMedida: string;
  co2Material: string;
  observacao: string;
}

@Component({
  selector: 'app-produto-ctt',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, HttpClientModule],
  templateUrl: './produto-ctt.component.html',
  styleUrls: ['./produto-ctt.component.css']
})
export class ProdutoCttComponent implements OnInit {
  // Propriedades de dados
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  produtosPaginados: Produto[] = [];

  // Propriedades de filtro
  filtroCodigoTecnico: string = '';
  filtroMaterial: string = '';
  filtroFornecedor: string = '';
  filtroFabrica: string = '';

  // Propriedades de paginação
  paginaAtual: number = 1;
  registrosPorPagina: number = 10;
  totalRegistros: number = 0;

  // Propriedades de estado
  isLoading: boolean = false;
  showModal: boolean = false;
  modoEdicao: boolean = false;
  produtoSelecionado: Produto | null = null;
  erro: string = '';

  // Formulário
produtoForm: ProdutoForm = {
  material: '',
  codigoTecnico: '',
  fornecedor: '',
  fabrica: '',
  codigoProdProtheus: '',
  materialBase: '',
  status: '',
  massaEspecifica: null,
  massaUnitaria: null,
  unidadeMedida: '',
  co2Material: '',
  observacao: ''
};

  // Referência ao Math para usar no template
  Math = Math;

  // URL base da API
  private readonly apiUrl = 'http://localhost:5098/api/ProdutoCTT';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.isLoading = true;
    this.erro = '';

    // Dados mock para exemplo
    const produtosMock: Produto[] = [
      { id: 1, material: 'CIMENTO - CP I - 40 RS', codigoTecnico: 'X1', fornecedor: 'Votorantim', fabrica: 'Santa Helena' },
      { id: 2, material: 'CIMENTO - CP I - ARI RS', codigoTecnico: 'A1', fornecedor: 'Mizu', fabrica: 'Manaus' },
      { id: 3, material: 'Agregado Graúdo - Brita 1 - F 40', codigoTecnico: 'X2', fornecedor: 'Mizu', fabrica: 'Manaus' },
      { id: 4, material: 'CIMENTO - CP I - 40 RS', codigoTecnico: 'X3', fornecedor: 'Mizu', fabrica: 'Mogi das Cruzes' },
      { id: 5, material: 'CIMENTO - CP I - 40 RS', codigoTecnico: 'X4', fornecedor: 'Mizu', fabrica: 'Mogi das Cruzes' },
      { id: 6, material: 'CIMENTO - CP I - 40 RS', codigoTecnico: 'X5', fornecedor: 'Mizu', fabrica: 'Mogi das Cruzes' }
    ];

    setTimeout(() => {
      this.produtos = produtosMock;
      this.aplicarFiltroLocal();
      this.isLoading = false;
    }, 500);
  }

  aplicarFiltro() {
    this.paginaAtual = 1;
    this.aplicarFiltroLocal();
  }

  aplicarFiltroLocal() {
    this.produtosFiltrados = this.produtos.filter(produto => {
      return (!this.filtroMaterial || produto.material.toLowerCase().includes(this.filtroMaterial.toLowerCase())) &&
             (!this.filtroCodigoTecnico || produto.codigoTecnico.toLowerCase().includes(this.filtroCodigoTecnico.toLowerCase())) &&
             (!this.filtroFornecedor || produto.fornecedor.toLowerCase().includes(this.filtroFornecedor.toLowerCase())) &&
             (!this.filtroFabrica || produto.fabrica.toLowerCase().includes(this.filtroFabrica.toLowerCase()));
    });

    this.totalRegistros = this.produtosFiltrados.length;
    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.registrosPorPagina;
    const fim = inicio + this.registrosPorPagina;
    this.produtosPaginados = this.produtosFiltrados.slice(inicio, fim);
  }

  alterarRegistrosPorPagina() {
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina() {
    const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    if (this.paginaAtual < totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

novo() {
  this.modoEdicao = false;
  this.produtoSelecionado = null;
  this.produtoForm = {
    material: '',
    codigoTecnico: '',
    fornecedor: '',
    fabrica: '',
    codigoProdProtheus: '',
    materialBase: '',
    status: '',
    massaEspecifica: null,
    massaUnitaria: null,
    unidadeMedida: '',
    co2Material: '',
    observacao: ''
  };
  this.showModal = true;
}

editar(produto: Produto) {
  this.modoEdicao = true;
  this.produtoSelecionado = produto;
  this.produtoForm = {
    material: produto.material,
    codigoTecnico: produto.codigoTecnico,
    fornecedor: produto.fornecedor,
    fabrica: produto.fabrica,
    codigoProdProtheus: produto.codigoProdProtheus || '',
    materialBase: produto.materialBase || '',
    status: produto.status || '',
    massaEspecifica: produto.massaEspecifica || null,
    massaUnitaria: produto.massaUnitaria || null,
    unidadeMedida: produto.unidadeMedida || '',
    co2Material: produto.co2Material || '',
    observacao: produto.observacao || ''
  };
  this.showModal = true;
}

  fecharModal() {
    this.showModal = false;
    this.modoEdicao = false;
    this.produtoSelecionado = null;
  }

salvarProduto() {
  if (this.modoEdicao && this.produtoSelecionado) {
    // Atualizar produto existente
    const index = this.produtos.findIndex(p => p.id === this.produtoSelecionado!.id);
    if (index !== -1) {
      this.produtos[index] = {
        id: this.produtoSelecionado.id,
        material: this.produtoForm.material,
        codigoTecnico: this.produtoForm.codigoTecnico,
        fornecedor: this.produtoForm.fornecedor,
        fabrica: this.produtoForm.fabrica,
        codigoProdProtheus: this.produtoForm.codigoProdProtheus,
        materialBase: this.produtoForm.materialBase,
        status: this.produtoForm.status,
        massaEspecifica: this.produtoForm.massaEspecifica,
        massaUnitaria: this.produtoForm.massaUnitaria,
        unidadeMedida: this.produtoForm.unidadeMedida,
        co2Material: this.produtoForm.co2Material,
        observacao: this.produtoForm.observacao
      };
    }
  } else {
    // Criar novo produto
    const novoProduto: Produto = {
      id: Math.max(...this.produtos.map(p => p.id), 0) + 1,
      material: this.produtoForm.material,
      codigoTecnico: this.produtoForm.codigoTecnico,
      fornecedor: this.produtoForm.fornecedor,
      fabrica: this.produtoForm.fabrica,
      codigoProdProtheus: this.produtoForm.codigoProdProtheus,
      materialBase: this.produtoForm.materialBase,
      status: this.produtoForm.status,
      massaEspecifica: this.produtoForm.massaEspecifica,
      massaUnitaria: this.produtoForm.massaUnitaria,
      unidadeMedida: this.produtoForm.unidadeMedida,
      co2Material: this.produtoForm.co2Material,
      observacao: this.produtoForm.observacao
    };
    this.produtos.push(novoProduto);
  }

  this.aplicarFiltroLocal();
  this.fecharModal();
}
}
