import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';

// Interface para o material que vem da API (formato flexível)
interface MaterialApi {
  id?: number;
  IdMaterialBase?: number;
  nome?: string;
  Nome?: string;
  name?: string; // Alternativa em inglês
  classe?: string;
  Classe?: string;
  class?: string; // Alternativa em inglês
  tipo?: string;
  Tipo?: string;
  type?: string; // Alternativa em inglês
  complemento?: string;
  Complemento?: string;
  complement?: string; // Alternativa em inglês
  [key: string]: any; // Permite propriedades adicionais
}

// Interface para o material usado internamente (formato padronizado)
interface Material {
  id: number;
  nome: string;
  sigla: string;
  classe?: string;
  tipo?: string;
  complemento?: string;
}

interface MaterialForm {
  nome: string;
  sigla: string;
  material: string;
  codigoTecnico: string;
  codigoProdProtheus: string;
  materialBase: string;
  status: string;
  fornecedor: string;
  fabrica: string;
  massaEspecifica: number | null;
  massaUnitaria: number | null;
  unidadeMedida: string;
  co2Material: string;
  co2Transporte: string;
  distancia: number | null;
  valorGerencial: boolean;
  freteGerencial: boolean;
  dataInicioValor: string;
  valorGerencialInput: number | null;
  dataInicioFrete: string;
  valorFrete: number | null;
  observacao: string;
}


interface ApiResponse {
  success: boolean;
  data: MaterialApi[];
  aaData?: MaterialApi[]; // Para formato DataTables
  iTotalRecords?: number;
  totalRecords?: number;
  message?: string;
  total?: number;
}

@Component({
  selector: 'app-produto-unidade',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, HttpClientModule],
  templateUrl: './produto-unidade.component.html',
  styleUrls: ['./produto-unidade.component.css']
})
export class ProdutoUnidadeComponent implements OnInit {
  // Propriedades de dados
  materiais: Material[] = [];
  materiaisFiltrados: Material[] = [];
  materiaisPaginados: Material[] = [];

  // Propriedades de filtro
  filtroNome: string = '';

  // Propriedades de paginação
  paginaAtual: number = 1;
  registrosPorPagina: number = 10;
  totalRegistros: number = 0;

  // Propriedades de estado
  isLoading: boolean = false;
  showModal: boolean = false;
  modoEdicao: boolean = false;
  materialSelecionado: Material | null = null;
  erro: string = '';

  // Formulário
materialForm: MaterialForm = {
  nome: '',
  sigla: '',
  material: '',
  codigoTecnico: '',
  codigoProdProtheus: '',
  materialBase: '',
  status: '',
  fornecedor: '',
  fabrica: '',
  massaEspecifica: null,
  massaUnitaria: null,
  unidadeMedida: '',
  co2Material: '',
  co2Transporte: '',
  distancia: null,
  valorGerencial: false,
  freteGerencial: false,
  dataInicioValor: '',
  valorGerencialInput: null,
  dataInicioFrete: '',
  valorFrete: null,
  observacao: ''
};
  // Debug - para mostrar resposta da API
  apiResponse: any = null;
  showApiResponse: boolean = true;

  // Referência ao Math para usar no template
  Math = Math;

  // URL base da API
  private readonly apiUrl = 'http://localhost:5098/api/MaterialBase';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.carregarMateriais();
  }
// Métodos de carregamento de dados
carregarMateriais() {
  this.isLoading = true;
  this.erro = '';

  // Dados mock para a tela de Produto Unidade (baseado na imagem)
  const materiaisMock: Material[] = [
    { id: 1, nome: 'Unidade APG', sigla: 'APG' },
    { id: 2, nome: 'Unidade ATB', sigla: 'ATB' },
    { id: 3, nome: 'Unidade BBT', sigla: 'BBT' },
    { id: 4, nome: 'Unidade BGA', sigla: 'BGA' },
    { id: 5, nome: 'Unidade BGP', sigla: 'BGP' },
    { id: 6, nome: 'Unidade BRA', sigla: 'BRA' },
    { id: 7, nome: 'Unidade BRI', sigla: 'BRI' },
    { id: 8, nome: 'Unidade CCL', sigla: 'CCL' },
    { id: 9, nome: 'Unidade AMG', sigla: 'AMG' },
    { id: 10, nome: 'Unidade ARI', sigla: 'ARI' },
    { id: 11, nome: 'Unidade ITF', sigla: 'ITF' }
  ];

  // Simular delay da API
  setTimeout(() => {
    // Aplicar filtro se existir
    let materiaisFiltrados = materiaisMock;

    if (this.filtroNome && this.filtroNome.trim() !== '') {
      materiaisFiltrados = materiaisMock.filter(material =>
        material.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
        (material.sigla && material.sigla.toLowerCase().includes(this.filtroNome.toLowerCase()))
      );
    }

    // Simular paginação
    const inicio = (this.paginaAtual - 1) * this.registrosPorPagina;
    const fim = inicio + this.registrosPorPagina;

    this.materiais = materiaisFiltrados;
    this.materiaisFiltrados = materiaisFiltrados;
    this.materiaisPaginados = materiaisFiltrados.slice(inicio, fim);
    this.totalRegistros = materiaisFiltrados.length;

    // Para debug
    this.apiResponse = {
      success: true,
      data: materiaisFiltrados,
      totalRecords: materiaisFiltrados.length,
      page: this.paginaAtual,
      pageSize: this.registrosPorPagina
    };

    console.log('Dados mock carregados:', {
      total: materiaisFiltrados.length,
      pagina: this.paginaAtual,
      registrosPorPagina: this.registrosPorPagina,
      materiaisPaginados: this.materiaisPaginados
    });

    this.isLoading = false;
  }, 800); // Simular delay de 800ms
}

  // Métodos de filtro
  aplicarFiltro() {
    // Como a API faz a filtragem, vamos recarregar os dados
    this.paginaAtual = 1;
    this.carregarMateriais();
  }

  limparFiltro() {
    this.filtroNome = '';
    this.aplicarFiltro();
  }

  // Métodos de paginação
  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.registrosPorPagina;
    const fim = inicio + this.registrosPorPagina;
    this.materiaisPaginados = this.materiaisFiltrados.slice(inicio, fim);
  }

  alterarRegistrosPorPagina() {
    this.paginaAtual = 1;
    this.carregarMateriais();
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.carregarMateriais();
    }
  }

  proximaPagina() {
    const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    if (this.paginaAtual < totalPaginas) {
      this.paginaAtual++;
      this.carregarMateriais();
    }
  }

  // Métodos do modal
novo() {
  this.modoEdicao = false;
  this.materialSelecionado = null;
  this.materialForm = {
    nome: '',
    sigla: '',
    material: '',
    codigoTecnico: '',
    codigoProdProtheus: '',
    materialBase: '',
    status: '',
    fornecedor: '',
    fabrica: '',
    massaEspecifica: null,
    massaUnitaria: null,
    unidadeMedida: '',
    co2Material: '',
    co2Transporte: '',
    distancia: null,
    valorGerencial: false,
    freteGerencial: false,
    dataInicioValor: '',
    valorGerencialInput: null,
    dataInicioFrete: '',
    valorFrete: null,
    observacao: ''
 };
  this.showModal = true;
}

editar(material: Material) {
  this.modoEdicao = true;
  this.materialSelecionado = material;
  this.materialForm = {
    nome: material.nome,
    sigla: material.sigla || '',
    material: 'CIMENTO - CP I - 40 RS', // Valor padrão baseado na imagem
    codigoTecnico: 'X1', // Valor padrão baseado na imagem
    codigoProdProtheus: '123', // Valor padrão baseado na imagem
    materialBase: 'CIMENTO - CP I - 40...', // Valor padrão baseado na imagem
    status: 'Ativo', // Valor padrão baseado na imagem
    fornecedor: 'Votorantim', // Valor padrão baseado na imagem
    fabrica: 'Santa Helena', // Valor padrão baseado na imagem
    massaEspecifica: 2220, // Valor padrão baseado na imagem
    massaUnitaria: 2000, // Valor padrão baseado na imagem
    unidadeMedida: 'Kg', // Valor padrão baseado na imagem
    co2Material: 'observacao', // Valor padrão baseado na imagem
    co2Transporte: '123', // Valor padrão baseado na imagem
    distancia: 2222, // Valor padrão baseado na imagem
    valorGerencial: true, // Valor padrão baseado na imagem
    freteGerencial: true, // Valor padrão baseado na imagem
    dataInicioValor: '',
    valorGerencialInput: null,
    dataInicioFrete: '2025-02-08', // Valor padrão baseado na imagem
    valorFrete: 11, // Valor padrão baseado na imagem
    observacao: 'observacao' // Valor padrão baseado na imagem
  };
  this.showModal = true;
}

  fecharModal() {
    this.showModal = false;
    this.modoEdicao = false;
    this.materialSelecionado = null;
  }

salvarMaterial() {
  if (this.modoEdicao && this.materialSelecionado) {
    // Atualizar material existente localmente (mock)
    const index = this.materiais.findIndex(m => m.id === this.materialSelecionado!.id);
    if (index !== -1) {
      this.materiais[index] = {
        ...this.materialSelecionado,
        nome: this.materialForm.nome,
        sigla: this.materialForm.sigla
      };
    }
  } else {
    // Criar novo material localmente (mock)
    const novoMaterial: Material = {
      id: Math.max(...this.materiais.map(m => m.id), 0) + 1,
      nome: this.materialForm.nome,
      sigla: this.materialForm.sigla
    };
    this.materiais.push(novoMaterial);
  }

  this.carregarMateriais(); // Recarregar lista
  this.fecharModal();
}
  // Método para recarregar dados
  recarregar() {
    this.carregarMateriais();
  }

  // Método para alternar visualização da resposta da API
  toggleApiResponse() {
    this.showApiResponse = !this.showApiResponse;
  }
}
