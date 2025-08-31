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
  selector: 'app-material-tipo',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, HttpClientModule],
  templateUrl: './material-tipo.component.html',
  styleUrls: ['./material-tipo.component.css']
})
export class MaterialTipoComponent implements OnInit {
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
    classe: '',
    tipo: '',
    complemento: ''
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

  // Método para mapear dados da API para o formato interno
  private mapearMaterial(materialApi: any, index: number): Material {
    // Se for um array (formato DataTables), usar os índices
    if (Array.isArray(materialApi)) {
      return {
        id: materialApi[0] || index + 1, // Primeiro elemento = ID
        nome: materialApi[1] || 'Nome não informado', // Segundo elemento = Nome
        classe: materialApi[2] || undefined,
        tipo: materialApi[3] || undefined,
        complemento: materialApi[4] || undefined
      };
    }

    // Se for um objeto
    return {
      id: materialApi.id || materialApi.IdMaterialBase || index + 1,
      nome: materialApi.nome || materialApi.Nome || materialApi.name || 'Nome não informado',
      classe: materialApi.classe || materialApi.Classe || materialApi.class || undefined,
      tipo: materialApi.tipo || materialApi.Tipo || materialApi.type || undefined,
      complemento: materialApi.complemento || materialApi.Complemento || materialApi.complement || undefined
    };
  }

  // Métodos de carregamento de dados
  carregarMateriais() {
  this.isLoading = true;
  this.erro = '';

  // Payload baseado no curl fornecido - versão corrigida
  const searchPayload = {
    sEcho: "2",
    iDisplayStart: ((this.paginaAtual - 1) * this.registrosPorPagina).toString(),
    iDisplayLength: this.registrosPorPagina.toString(),
    iSortCol_0: null,
    sSortDir_0: null,
    sColumns: "IdMaterialBase,Nome",
    DisplayStart: (this.paginaAtual - 1) * this.registrosPorPagina,
    DisplayLength: this.registrosPorPagina,
    SortCol_0: 0,
    Columns: ["IdMaterialBase", "Nome"],
    QtyColumn: 2,
    // Tentar diferentes formatos de filtro
    FilterColumns: this.filtroNome ? [
      {
        Column: "Nome",
        Value: this.filtroNome,
        Operation: "contains"
      }
    ] : [],
    // Alternativas de formato para o filtro
    search: this.filtroNome ? {
      value: this.filtroNome,
      regex: false
    } : { value: "", regex: false },
    // Formato DataTables padrão
    columns: [
      {
        data: "IdMaterialBase",
        name: "IdMaterialBase",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false }
      },
      {
        data: "Nome",
        name: "Nome",
        searchable: true,
        orderable: true,
        search: {
          value: this.filtroNome || "",
          regex: false
        }
      }
    ],
    draw: 1,
    start: (this.paginaAtual - 1) * this.registrosPorPagina,
    length: this.registrosPorPagina,
    nome: this.filtroNome || "",
    nomeFilter: this.filtroNome || ""
  };

  console.log('Chamando API POST:', `${this.apiUrl}/search`);
  console.log('Payload com filtro corrigido:', searchPayload);
  console.log('Filtro aplicado:', this.filtroNome);

  this.http.post<any>(`${this.apiUrl}/search`, searchPayload, {
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    }
  }).subscribe({
    next: (response) => {
      console.log('Resposta da API:', response);
        this.apiResponse = response; // Para debug

        let materiaisApi: MaterialApi[] = [];

        // Tentar diferentes estruturas de resposta
        if (Array.isArray(response)) {
          // Resposta é array direto
          materiaisApi = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Resposta tem propriedade 'data'
          materiaisApi = response.data;
        } else if (response.aaData && Array.isArray(response.aaData)) {
          // Resposta DataTables tem propriedade 'aaData'
          materiaisApi = response.aaData;
        } else if (response.items && Array.isArray(response.items)) {
          // Resposta tem propriedade 'items'
          materiaisApi = response.items;
        } else if (response.results && Array.isArray(response.results)) {
          // Resposta tem propriedade 'results'
          materiaisApi = response.results;
        } else if (response.materials && Array.isArray(response.materials)) {
          // Resposta tem propriedade 'materials'
          materiaisApi = response.materials;
        } else if (typeof response === 'object' && response !== null) {
          // Tentar usar o objeto completo como um item
          materiaisApi = [response];
        } else {
          // Caso não conseguir identificar a estrutura
          console.warn('Estrutura de resposta não reconhecida:', response);
          materiaisApi = [];
        }

        // Mapear os dados da API para o formato interno
        this.materiais = materiaisApi.map((material, index) =>
          this.mapearMaterial(material, index)
        );

        // Atualizar total de registros se disponível na resposta
        if (response.iTotalRecords || response.totalRecords) {
          this.totalRegistros = response.iTotalRecords || response.totalRecords;
        } else {
          this.totalRegistros = this.materiais.length;
        }

        console.log('Materiais mapeados:', this.materiais);
        console.log('Total de registros:', this.totalRegistros);

        this.materiaisFiltrados = this.materiais;
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar materiais:', error);
        let errorMessage = 'Erro desconhecido';

        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          errorMessage = `Erro HTTP ${error.status}: ${error.statusText || 'Erro no servidor'}`;
        }

        this.apiResponse = error; // Para debug
        this.materiais = [];
        this.materiaisFiltrados = [];
        this.materiaisPaginados = [];
        this.totalRegistros = 0;
        this.isLoading = false;
      }
    });
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
      classe: '',
      tipo: '',
      complemento: ''
    };
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
    this.modoEdicao = false;
    this.materialSelecionado = null;
  }

  salvarMaterial() {
    const materialData = {
      nome: this.materialForm.nome,
      classe: this.materialForm.classe,
      tipo: this.materialForm.tipo,
      complemento: this.materialForm.complemento
    };

    if (this.modoEdicao && this.materialSelecionado) {
      // Atualizar material existente via API
      const url = `${this.apiUrl}/${this.materialSelecionado.id}`;
      this.http.put<any>(url, materialData).subscribe({
        next: (response) => {
          console.log('Material atualizado:', response);
          this.carregarMateriais(); // Recarregar lista
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar material:', error);
          this.erro = `Erro ao atualizar: ${error.message || 'Erro desconhecido'}`;
        }
      });
    } else {
      // Criar novo material via API
      this.http.post<any>(this.apiUrl, materialData).subscribe({
        next: (response) => {
          console.log('Material criado:', response);
          this.carregarMateriais(); // Recarregar lista
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao criar material:', error);
          this.erro = `Erro ao criar: ${error.message || 'Erro desconhecido'}`;
        }
      });
    }
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
