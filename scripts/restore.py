"""Execute com a API parada. Recusa substituir bancos existentes."""
import argparse
from scripts.backup import backup


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('backup')
    parser.add_argument('destination', help='Caminho livre para restaurar e testar')
    args = parser.parse_args()
    backup(args.backup, args.destination)
    print('Restaurado e validado:', args.destination)
